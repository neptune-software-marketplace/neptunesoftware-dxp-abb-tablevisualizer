namespace Convert {
    export const isX6Table = (obj: any): obj is X6Table => {
        return "ports" in obj && "position" in obj;
    };

    export function toX6(tableArray: NeptuneTable[]) {
        let formattedData: (X6Table | X6TableForeignKey)[] = [];

        tableArray.forEach((table, index) => {
            let formattedTable = {} as X6Table;

            const positionX = index === 0 ? 300 : 300 * (index + 1);
            const positionY = index === 0 ? 0 : 100 * (index + 1);

            formattedTable.id = table.id;
            formattedTable.shape = "tableNode";
            formattedTable.label = table.name;
            formattedTable.width = Configuration.NODE_WIDTH;
            formattedTable.height = Configuration.LINE_HEIGHT;
            formattedTable.position = {
                x: positionX,
                y: positionY,
            };

            formattedTable.attrs = {
                body: {
                    class: "x6table",
                },
                label: {
                    fill: "black",
                },
                text: {
                    text: table.name,
                },
            };

            formattedTable.ports = [];

            // add table ID as first port
            formattedTable.ports.push({
                id: `${index + 1}-1`,
                columnId: "",
                group: "list",
                isPrimary: true,
                isUnique: true,
                isNullable: true,
                columnName: "id",
                dataType: "uuid",
                attrs: {
                    portBody: {
                        class: "x6PrimaryKey",
                    },
                    portNameLabel: {
                        text: "id",
                    },
                    portTypeLabel: {
                        text: "uuid",
                    },
                    portProperties: {
                        text: "P",
                    },
                },
            });

            // add rest of table columns
            table.fields.forEach((field, x) => {
                let properties = "";
                if (field.isUnique) {
                    properties += "U";
                }
                if (field.isNullable) {
                    properties += "N";
                }

                formattedTable.ports.push({
                    id: `${index + 1}-${x + 2}`,
                    columnId: field.id,
                    columnName: field.fieldName,
                    group: "list",
                    isUnique: field.isUnique,
                    isNullable: field.isNullable,
                    dataType: field.fieldType,
                    attrs: {
                        portBody: {
                            class: "x6ConnectorLine",
                        },
                        portNameLabel: {
                            text: field.fieldName,
                        },
                        portTypeLabel: {
                            text: field.fieldType,
                        },
                        portProperties: {
                            text: properties,
                        },
                    },
                });
            });
            formattedData.push(formattedTable);
        });

        // Add connections
        tableArray.forEach((table) => {
            if (table.foreignKeys.length) {
                table.foreignKeys.forEach((key, index) => {
                    for (let i = 0; i < key.columns.length; i++) {
                        let formattedLink = {} as X6TableForeignKey;

                        formattedLink.foreignKeyId = key.id;
                        //@ts-ignore
                        formattedLink.id = ModelData.genID();
                        formattedLink.shape = "default";

                        const isCompositeKey = key.columns.length > 1;
                        if (isCompositeKey) {
                            formattedLink.label = `FK ${index + 1}`;
                        }
                        formattedLink.isCompositeKey = isCompositeKey;

                        const fromTable = formattedData.find(
                            (formattedTable) => formattedTable.label === key.referencedTable
                        );

                        const toTable = formattedData.find(
                            (formattedTable) => formattedTable.label === table.name
                        );

                        if (!fromTable || !toTable) return;

                        if (isX6Table(fromTable) && isX6Table(toTable)) {
                            const linkSource = fromTable.ports.find(
                                (port) =>
                                    port.attrs.portNameLabel.text ===
                                    key.columns[i].referencedColumnName
                            );

                            const linkTarget = toTable.ports.find(
                                (port) => port.attrs.portNameLabel.text === key.columns[i].fieldName
                            );

                            formattedLink.source = {
                                cell: fromTable.id,
                                port: linkSource.id,
                            };

                            formattedLink.target = {
                                cell: toTable.id,
                                port: linkTarget.id,
                            };

                            formattedLink.attrs = {
                                line: {
                                    stroke: "var(--nepBrandYellow)",
                                    strokeWidth: 2,
                                },
                            };

                            formattedLink.zIndex = 0;

                            formattedData.push(formattedLink);
                        }
                    }
                });
            }
        });
        return formattedData;
    }

    export function createNeptuneForeignKey(
        fromTable: NeptuneTable,
        fromColumn: NeptuneTableColumn,
        toColumn: NeptuneTableColumn
    ): NeptuneForeignKey {
        const newForeignKey = {
            id: ModelData.genID(),
            name: "",
            referencedTable: fromTable.name,
            referencedTableId: fromTable.id,
            referencedTableColumns: fromTable.fields,
            columns: [
                {
                    referencedColumnId: fromColumn.id,
                    id: toColumn.id,
                    fieldName: toColumn.fieldName,
                    fieldType: toColumn.fieldType,
                    isUnique: toColumn.isUnique,
                    referencedColumnName: fromColumn.fieldName,
                },
            ],
        };

        return newForeignKey;
    }
}
