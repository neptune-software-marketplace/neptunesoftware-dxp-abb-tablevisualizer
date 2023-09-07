namespace CustomComponent {
    export let graph = null;

    const graphConfig = {
        nodeConfig: Configuration.nodes,
        edgeConfig: Configuration.edges,
        connectionConfig: Configuration.connection,
        portLayoutName: "tablePortPosition",
        portLayoutFunction: Configuration.tablePortPosition,
        forcePortLayout: true,
    };

    export function graphIsRendered() {
        const graphContainerId = graphContainer.getId();
        const containerElement = document.getElementById(graphContainerId);
        if (!containerElement) return false;
        return containerElement.childNodes.length !== 0;
    }

    export async function init() {
        const awaitDom = () => {
            const containerDomRef = graphContainer.getDomRef() as HTMLDivElement;
            if (!containerDomRef) {
                return setTimeout(awaitDom, 10);
            }
            graphCore.init(containerDomRef, graphConfig).then((data) => {
                graph = data;
                addEventListeners();
            });
        };
        awaitDom();

        modelChangedTables.setData([]);
        modelCurrentPositions.setData([]);
        modelAppControl.setData({
            changesMade: false,
        });
    }

    function saveNodePosition(node, x, y) {
        const nodePosition = modelCurrentPositions.getData().find((x) => x.id === node.id);
        if (!nodePosition) return;
        nodePosition.position.x = x;
        nodePosition.position.y = y;
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
        }
    }

    export function resetChanges() {
        modelChangedTables.setData([]);
        modelAppControl.getData().changesMade = false;
        modelAppControl.refresh(true);
    }

    function openTableMenu(node: X6Table) {
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
        const formattedData = Convert.toX6(tables);

        formattedData.forEach((cell) => {
            if (!Convert.isX6Table(cell)) return;
            const newPositionNode = modelCurrentPositions.getData().find((x) => x.id === cell.id);
            if (newPositionNode) {
                cell.position.x = newPositionNode.position.x;
                cell.position.y = newPositionNode.position.y;
            }
        });

        modelSelectedTablesFormatted.setData(formattedData);

        graphCore.addCells(formattedData);

        // Save new positions
        const tablePositions = formattedData
            .filter(Convert.isX6Table)
            .map((x) => ({ id: x.id, position: x.position }));

        modelCurrentPositions.setData(tablePositions);
    }

    export function centerContent() {
        graphCore.centerContent();
    }

    export function clearGraph() {
        graphCore.resetGraph();
        modelSelectedTablesFormatted.setData([]);
        modelSelectedTablesNeptune.setData([]);
        modelCurrentPositions.setData([]);
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
        const cells = modelSelectedTablesFormatted.getData().filter((x) => nodeIds.includes(x.id));
        graphCore.removeCells(cells);
    }

    export async function refreshSelection() {
        graphCore.resetGraph();
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

    export function addEventListeners() {
        graph.on("edge:connected", ({ edge }) => {
            const variantEdge = graphConfig.edgeConfig.find((edge) => edge.name === "variant");
            if (variantEdge) {
                const edgeAttrs = {
                    line: {
                        //@ts-ignore
                        ...variantEdge.config.attrs?.line,
                        id: `edge-${edge.id}`,
                    },
                };
                edge.setAttrs(edgeAttrs);
            }
            ForeignKey.updateFK("Add", edge);
        });

        graph.on("edge:mouseenter", ({ cell }) => {
            cell.addTools([Configuration.btnDelete]);
        });

        graph.on("edge:mouseleave", ({ cell }) => {
            if (cell.hasTool("button")) {
                cell.removeTool("button");
            }
        });

        // right-click
        graph.on("node:contextmenu", ({ e, x, y, node, view }) => {
            openTableMenu(node);
        });

        // right-click
        graph.on("edge:contextmenu", ({ e, x, y, edge, view }) => {
            ForeignKey.confirmRemove({ edge });
        });

        graph.on("node:moved", ({ e, x, y, node, view }) => {
            saveNodePosition(node, x, y);
        });
    }
}
