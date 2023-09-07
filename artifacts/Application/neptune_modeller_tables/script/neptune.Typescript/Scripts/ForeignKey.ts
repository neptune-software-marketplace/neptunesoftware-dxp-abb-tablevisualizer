namespace ForeignKey {
    function addNewFK(
        tableData: NeptuneTable,
        fromTableNeptune: NeptuneTable,
        fromTableCol: NeptuneTableColumn,
        toTableNeptune: NeptuneTable,
        toTableCol: NeptuneTableColumn,
        tableAlreadyChanged: boolean
    ): NeptuneTable {
        const newForeignKey = Convert.createNeptuneForeignKey(
            fromTableNeptune,
            fromTableCol,
            toTableCol
        );

        if (tableAlreadyChanged) {
            const previousForeignKey = toTableNeptune.foreignKeys.find(
                (key) => key.referencedTable === newForeignKey.referencedTable
            );
            // id & name (autogenerated) will be different, but if rest is the same, it's the same FK
            if (previousForeignKey) {
                const isSameFK = Util.areSameObjects(newForeignKey, previousForeignKey, true);
                if (isSameFK) {
                    newForeignKey.id = previousForeignKey.id;
                    newForeignKey.name = previousForeignKey.name;
                }
            }
        }

        return {
            ...tableData,
            foreignKeys: [...tableData.foreignKeys, newForeignKey],
        };
    }

    function removeFK(
        tableData: NeptuneTable,
        toTableNeptune: NeptuneTable,
        edgeData,
        fromTableId: string,
        fromTableCol: NeptuneTableColumn
    ) {
        const updatedForeignKeys = toTableNeptune.foreignKeys.filter((key) => {
            const columnIds = key.columns.map((column) => column.id);
            return (
                key.id !== edgeData.foreignKeyId ||
                (key.referencedTableId !== fromTableId && !columnIds.includes(fromTableCol.id))
            );
        });

        const identicalArrays = Util.areSameArrays(updatedForeignKeys, toTableNeptune.foreignKeys);
        if (identicalArrays) return;

        return { ...tableData, foreignKeys: [...updatedForeignKeys] };
    }

    function getNeptuneTableAndPort(tableId: string, portId: string) {
        const selectedTables = modelSelectedTablesNeptune.getData();
        const formattedTables = modelSelectedTablesFormatted.getData();

        const tableData = selectedTables.find((table) => table.id === tableId);

        const portData = formattedTables
            .find((table) => table.id === tableId)
            .ports.find((port) => port.id === portId);

        return { table: tableData, port: portData };
    }

    function getFKSourceAndTarget(edge) {
        const {
            source: { cell: fromTableId, port: fromPortId },
            target: { cell: toTableId, port: toPortId },
        } = edge.store.data;

        if (!toTableId) return;

        const { table: fromTableNeptune, port: fromTablePort } = getNeptuneTableAndPort(
            fromTableId,
            fromPortId
        );
        const { table: toTableNeptune, port: toTablePort } = getNeptuneTableAndPort(
            toTableId,
            toPortId
        );

        const fromTableCol =
            fromTablePort.columnId === ""
                ? { fieldName: "id", id: "id" }
                : fromTableNeptune.fields.find((col) => col.id === fromTablePort.columnId);
        const toTableCol = toTableNeptune.fields.find((col) => col.id === toTablePort.columnId);

        return {
            fromTableId,
            toTableId,
            fromTableCol,
            toTableCol,
            fromTableNeptune,
            toTableNeptune,
        };
    }

    export function updateFK(changeAction: string, edge) {
        const selectedTables = modelSelectedTablesNeptune.getData();
        const changedTables = modelChangedTables.getData();

        const {
            fromTableId,
            toTableId,
            fromTableCol,
            toTableCol,
            fromTableNeptune,
            toTableNeptune,
        } = getFKSourceAndTarget(edge);

        let tableData = changedTables.find((table) => table.id === toTableId);
        let tableAlreadyChanged = tableData ? true : false;
        if (!tableData) {
            tableData = selectedTables.find((table) => table.id === toTableId);
        }

        let updatedTable;
        if (changeAction === "Add") {
            const existingFK = tableData.foreignKeys.find((key) =>
                key.columns.find((col) => col.id === toTableCol.id)
            );
            if (existingFK) {
                //@ts-ignore
                new sap.m.MessageBox.error(
                    `This column is already a foreign key, so this link cannot be added.`
                );
                edge.remove();
                return;
            }

            updatedTable = addNewFK(
                tableData,
                fromTableNeptune,
                fromTableCol,
                toTableNeptune,
                toTableCol,
                tableAlreadyChanged
            );
        }

        if (changeAction === "Remove") {
            const edgeData = edge.store.data;

            updatedTable = removeFK(tableData, toTableNeptune, edgeData, fromTableId, fromTableCol);

            if (edgeData.isCompositeKey) {
                const allEdges = CustomComponent.graph.getEdges();
                const compositeEdges = allEdges.filter(
                    (edge) => edge.store.data.foreignKeyId === edgeData.foreignKeyId
                );
                compositeEdges.forEach((edge) => {
                    edge.remove();
                });
            } else {
                edge.remove();
            }
        } 

        if (!updatedTable) return;

        if (tableAlreadyChanged) {
            tableData.foreignKeys = updatedTable.foreignKeys;
        } else {
            changedTables.push(updatedTable);
        }

        modelChangedTables.refresh(true);
        modelAppControl.getData().changesMade = true;
        modelAppControl.refresh(true);
    }

    export function confirmRemove({ edge }) {
        //@ts-ignore
        new sap.m.MessageBox.confirm("This action will delete this foreign key. Continue?", {
            title: "Delete foreign key",
            onClose: (action) => {
                if (action === "OK") {
                    updateFK("Remove", edge);
                }
            },
            styleClass: "",
            actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
            emphasizedAction: sap.m.MessageBox.Action.OK,
            initialFocus: null,
        });
    }
}
