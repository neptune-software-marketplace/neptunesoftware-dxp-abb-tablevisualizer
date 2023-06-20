namespace CustomComponent {
    let Graph;
    let MiniMap;
    export let graph = null;
    let nodeConfigName: string;
    let edgeConfigName: string;
    let portLayoutName: string;

    async function getX6Objects() {
        //@ts-ignore
        const X6Objects = await x6Script.getX6Objects();
        return X6Objects;
    }

    export function graphExists() {
        return graph !== null;
    }

    const containerDiv = document.getElementById("graphContainer") as HTMLDivElement;
    const minimapContainer = document.getElementById("minimapContainer") as HTMLDivElement;

    export async function init(graphConfig: GraphConfig, nodeRightClickFunction) {
        const X6Objects = await getX6Objects();
        //@ts-ignore
        Graph = X6Objects.Graph;
        //@ts-ignore
        MiniMap = X6Objects.MiniMap;

        if (graph) {
            destroy();
        }

        if (
            graphConfig.portLayoutFunction &&
            graphConfig.portLayoutName &&
            graphConfig.forcePortLayout
        ) {
            portLayoutName = graphConfig.portLayoutName;
            //@ts-ignore
            Graph.registerPortLayout(
                graphConfig.portLayoutName,
                graphConfig.portLayoutFunction,
                graphConfig.forcePortLayout
            );
        }

        nodeConfigName = graphConfig.nodeConfigName;
        edgeConfigName = graphConfig.edgeConfigName;

        //@ts-ignore
        Graph.registerNode(
            graphConfig.nodeConfigName,
            graphConfig.nodeConfig,
            graphConfig.overwriteNode
        );

        //@ts-ignore
        Graph.registerEdge(
            graphConfig.edgeConfigName,
            graphConfig.edgeConfig,
            graphConfig.overwriteEdge
        );

        //@ts-ignore
        graph = new Graph({
            container: containerDiv,
            connecting: graphConfig.connectionConfig,
            autoResize: true,
            panning: {
                enabled: true,
                eventTypes: ["leftMouseDown"],
            },
            mousewheel: {
                enabled: true,
                modifiers: ["ctrl", "meta"],
            },
        });

        graph.use(
            //@ts-ignore
            new MiniMap({
                container: minimapContainer,
                scalable: false,
                minScale: 5,
            })
        );

        /* graph.use(
            //@ts-ignore
            new X6Objects.Scroller({
                enabled: true
            })
        ) */

        graph.use(
            //@ts-ignore
            new X6Objects.History({
                enabled: true,
            })
        );

        graph.on("node:contextmenu", ({e, x, y, node, view}) => {
            nodeRightClickFunction(e, x, y, node, view);
        });
    }

    export function destroy() {
        if (nodeConfigName) {
            Graph.unregisterNode(nodeConfigName);
        }
        if (edgeConfigName) {
            Graph.unregisterEdge(edgeConfigName);
        }
        if (portLayoutName) {
            Graph.unregisterPortLayout(portLayoutName);
        }
        if (graph) {
            graph.dispose();
        }
    }

    const createCells = (items) => {
        const cells = [];
        items.forEach((item) => {
            if ("source" in item) {
                const edge = graph.createEdge(item);
                edge.setAttrs({body: {id: `edge-${item.id}`}});
                cells.push(edge);
            } else {
                const node = graph.createNode(item);
                node.setAttrs({body: {id: `node-${item.id}`}});
                cells.push(node);
            }
        });
        return cells;
    };

    export function addCells(formattedItems) {
        const cells = createCells(formattedItems);
        graph.resetCells(cells);
        graph.zoomToFit({ padding: 10, maxScale: 1 });
        //graph.fitToContent();
    }

    export function toggleEdgeVisibility() {
        if (graphExists()) {
            const cells = graph.getCells();
            cells.forEach((cell) => {
                if (cell.isEdge()) {
                    if (cell.isVisible()) {
                        cell.setVisible(false);
                    } else {
                        cell.setVisible(true);
                    }
                }
            });
        }
    }

    export function togglePanning() {
        graph.togglePanning();
    }

    export function centerContent() {
        graph.centerContent();
    }

    export function setBackground(color: string) {
        graph.drawBackground({
            color,
        });
    }

    export function clearBackground() {
        graph.clearBackground();
    }

    export function toggleHistory(): boolean {
        if (graph.isHistoryEnabled()) {
            graph.disableHistory();
        } else {
            graph.enableHistory();
        }
        return graph.isHistoryEnabled();
    }

    export function undo() {
        graph.undo();
    }

    export function redo() {
        graph.redo();
    }

    export function clearGraph() {
        graph.clearCells();
    }

    export function hideMinimap() {
        if (graph) {
            graph.disposePlugins("minimap");
            const minimapContainer = document.getElementById("minimapContainer") as HTMLDivElement;
            minimapContainer.style.display = "none";
        }
    }

    export function showMinimap() {
        if (graph) {
            graph.disposePlugins("minimap");
            graph.use(
                //@ts-ignore
                new MiniMap({
                    container: minimapContainer,
                })
            );
            minimapContainer.style.display = "block";
        }
    }

    export function removeCells(cells) {
        graph.removeCells(cells);
    }
}
