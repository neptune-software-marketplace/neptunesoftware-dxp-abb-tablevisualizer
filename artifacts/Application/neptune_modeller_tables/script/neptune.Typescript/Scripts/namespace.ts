namespace CustomComponent {
    const graphConfig = {
        nodeConfigName: "tableNode",
        nodeConfig: TableModellerConfig.nodeConfig,
        portLayoutName: "tablePortPosition",
        portLayoutFunction: TableModellerConfig.tablePortPosition,
        forcePortLayout: true,
        edgeConfigName: "tableEdge",
        edgeConfig: TableModellerConfig.edgeConfig,
        connectionConfig: TableModellerConfig.connectionConfig,
        overwriteNode: true,
        overwriteEdge: true,
    };

    export async function init() {
        const awaitDom = () => {
            const containerDomRef = graphContainer.getDomRef() as HTMLDivElement;
            if (!containerDomRef) {
                return setTimeout(awaitDom, 10);
            }
            graphCore.init(
                containerDomRef,
                graphConfig,
                openTableMenu,
                onForeignKeyChange,
                null,
                confirmRemoveFK
            );
        };
        awaitDom();

        modelChangedTables.setData([]);
        modelAppControl.setData({
            changesMade: false,
        });
    }

    export async function saveChanges() {
        const currentLayout = graphCore.getJSONview().cells;
        const nodePositions = [];
        currentLayout.forEach((cell) => {
            if (cell.shape === "tableNode") {
                nodePositions.push({ id: cell.id, position: cell.position });
            }
        });
        const selectedTableIds = modelSelectedTablesNeptune.getData().map((table) => table.id);
        const changedTables = modelChangedTables.getData();
        const savedTables = await saveTables(changedTables);
        if (savedTables) {
            sap.m.MessageToast.show("Tables saved");
            displayTables(selectedTableIds);
            resetChanges();
            const { nodes } = graphCore.getCells();
            nodes.forEach((node) => {
                const oldPosition = nodePositions.find((x) => x.id === node.id);
                node.position(oldPosition.position.x, oldPosition.position.y);
            });
        }
    }

    export function resetChanges() {
        modelChangedTables.setData([]);
        //@ts-ignore
        modelAppControl.oData.changesMade = false;
        modelAppControl.refresh(true);
    }

    function onForeignKeyChange(changeAction: string, options) {
        let updatedTable;

        const edgeData = options.edge.store.data;

        if (!edgeData.target.cell) return;

        const selectedTables = modelSelectedTablesNeptune.getData();
        const formattedTables = modelSelectedTablesFormatted.getData();
        let changedTables = modelChangedTables.getData();

        const fromTableId = edgeData.source.cell;
        const fromTablePort = formattedTables
            .find((table) => table.id === edgeData.source.cell)
            .ports.find((port) => port.id === edgeData.source.port);

        const toTableId = edgeData.target.cell;
        const toTablePort = formattedTables
            .find((table) => table.id === edgeData.target.cell)
            .ports.find((port) => port.id === edgeData.target.port);

        const fromTableNeptune = selectedTables.find((table) => table.id === fromTableId);
        const toTableNeptune = selectedTables.find((table) => table.id === toTableId);

        let fromTableCol;
        if (fromTablePort.columnId === "") {
            fromTableCol = {
                name: "id",
                id: "id",
            };
        } else {
            fromTableCol = fromTableNeptune.fields.find((col) => col.id === fromTablePort.columnId);
        }
        const toTableCol = toTableNeptune.fields.find((col) => col.id === toTablePort.columnId);

        let tableData = changedTables.find((table) => table.id === toTableId);
        if (!tableData) {
            tableData = selectedTables.find((table) => table.id === toTableId);
        }

        if (changeAction === "Added") {
            const newForeignKey = TableModellerConfig.createNewForeignKey(
                fromTableNeptune,
                fromTableCol,
                toTableCol
            );

            updatedTable = {
                ...tableData,
                foreignKeys: [...tableData.foreignKeys, newForeignKey],
            };
        }
        if (changeAction === "Removed") {
            // What if more than one column in the FK?
            const updatedForeignKeys = toTableNeptune.foreignKeys.filter((key) => {
                return (
                    key.id !== edgeData.foreignKeyId ||
                    (key.referencedTableId !== fromTableId &&
                        key.columns[0].referencedColumnId !== fromTableCol.id) // TODO: Double check this logic
                );
            });
            updatedTable = { ...tableData, foreignKeys: [...updatedForeignKeys] };
        }

        const existingTable = changedTables.find((table) => table.id === updatedTable.id);
        if (existingTable) {
            existingTable.foreignKeys = updatedTable.foreignKeys;
        } else {
            changedTables.push(updatedTable);
        }
        modelChangedTables.refresh(true);
        //@ts-ignore
        modelAppControl.oData.changesMade = true;
        modelAppControl.refresh(true);
    }

    function confirmRemoveFK({ edge }) {
        //@ts-ignore
        new sap.m.MessageBox.confirm("This action will delete this foreign key. Continue?", {
            title: "Delete foreign key",
            onClose: (action) => {
                if (action === "OK") {
                    edge.remove();
                }
            },
            styleClass: "",
            actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
            emphasizedAction: sap.m.MessageBox.Action.OK,
            initialFocus: null,
        });
    }

    function openTableMenu(node) {
        const nodeHTMLElement = document.getElementById(`node-${node.id.replace(/-\w+$/, "")}`);
        modelPopoverMenu.setData(tableMenuActions);
        modelPopoverMenu.refresh();
        textSourceId.setText(node.id);
        tableMenu.openBy(nodeHTMLElement, false);
    }

    export async function displayTables(selectedTables: string[]) {
        const tableData = [];
        for (let i = 0; i < selectedTables.length; i++) {
            const table = await getTable(selectedTables[i]);
            tableData.push(table);
        }
        const tables = Array.isArray(tableData) ? tableData : [tableData];
        modelSelectedTablesNeptune.setData(tables);
        const formattedData = TableModellerConfig.formatTablesToX6(tables);
        modelSelectedTablesFormatted.setData(formattedData);

        graphCore.addCells(formattedData);
    }

    export function centerContent() {
        graphCore.centerContent();
    }

    export function setBackground(color: string) {
        graphCore.setBackground(color);
    }

    export function clearBackground() {
        graphCore.clearBackground();
    }

    export function clearGraph() {
        graphCore.clearGraph();
        modelSelectedTablesFormatted.setData([]);
        modelSelectedTablesNeptune.setData([]);
    }

    export function undo() {
        graphCore.undo();
    }

    export function redo() {
        graphCore.redo();
    }

    /* export function showMinimap() {
        graphCore.showMinimap();
    }

    export function hideMinimap() {
        graphCore.hideMinimap();
    } */

    export function removeCells(nodeIds: string[]) {
        graphCore.removeCells(nodeIds);
    }

    export async function refreshSelection() {
        graphCore.clearGraph();
        graphCore.addCells(modelSelectedTablesFormatted.getData());
    }

    export function hasSelection() {
        const selectedTables = modelSelectedTablesFormatted.getData();
        return selectedTables.length > 0;
    }

    export function getJSONview() {
        return graphCore.getJSONview();
    }

    export function addDiagramFromJSON(data) {
        graphCore.addDiagramFromJSON(data);
    }

    export function getCells() {
        return graphCore.getCells();
    }
}
