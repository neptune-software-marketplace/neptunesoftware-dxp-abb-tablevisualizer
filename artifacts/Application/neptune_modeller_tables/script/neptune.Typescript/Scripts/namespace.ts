namespace CustomComponent {
    const graphConfig = {
        nodeConfigName: "tableNode",
        nodeConfig: TableModeller.nodeConfig,
        portLayoutName: "tablePortPosition",
        portLayoutFunction: TableModeller.tablePortPosition,
        forcePortLayout: true,
        edgeConfigName: "tableEdge",
        edgeConfig: TableModeller.edgeConfig,
        connectionConfig: TableModeller.connectionConfig,
        overwriteNode: true,
        overwriteEdge: true,
    };

    export function initGraph() {
        graphCore.init(graphConfig, openTableMenu);
    }

    function openTableMenu(e, x, y, node, view) {
        const nodeHTMLElement = document.getElementById(`node-${node.id}`);
        modelPopoverMenu.setData(tableMenuActions);
        modelPopoverMenu.refresh();
        textSourceId.setText(node.id);
        popoverMenu.openBy(nodeHTMLElement, false);
    }

    export async function getConnectedTables(tableId: string) {
        const table = await getTable(tableId);
        const connectedTables = table.foreignKeys.map((key) => key.referencedTableId);
        const tables = [tableId, ...connectedTables];
        displayTables(tables);
    }

    export async function displayTables(selectedTables: string[]) {
        const tableData = [];
        for (let i = 0; i < selectedTables.length; i++) {
            const table = await getTable(selectedTables[i]);
            tableData.push(table);
        }
        const tables = Array.isArray(tableData) ? tableData : [tableData];
        modelSelectedTablesNeptune.setData(tables);
        const formattedData = TableModeller.formatTablesToX6(tables);
        modelSelectedTablesFormatted.setData(formattedData);
        graphCore.addCells(formattedData);
    }

    export function openDialog() {
        diaTables.open();
    }

    export function closeDialog() {
        diaTables.close();
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

    export function showMinimap() {
        graphCore.showMinimap();
    }

    export function hideMinimap() {
        graphCore.hideMinimap();
    }

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
}
