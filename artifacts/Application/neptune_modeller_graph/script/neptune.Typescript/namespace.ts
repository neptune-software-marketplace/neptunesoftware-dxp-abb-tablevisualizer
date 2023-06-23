namespace CustomComponent {
    let Graph;
    let MiniMap;
    let graph = null;
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
    //let minimapContainer;

    export async function init(
        container: HTMLDivElement,
        graphConfig: GraphConfig,
        nodeRightClickFunction
    ) {
        const containerDiv = container;

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

        /* graph.use(
            //@ts-ignore
            new MiniMap({
                container: minimapContainer,
                width: 200,
                height: 160,
                scalable: true,
            })
        ); */

        graph.use(
            //@ts-ignore
            new X6Objects.History({
                enabled: true,
            })
        );

        graph.on("node:contextmenu", ({ e, x, y, node, view }) => {
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
            graph = null;
        }
    }

    const createCells = (items) => {
        const cells = [];
        items.forEach((item) => {
            if ("source" in item) {
                const edge = graph.createEdge(item);
                edge.setAttrs({ body: { id: `edge-${item.id}` } });
                cells.push(edge);
            } else {
                const node = graph.createNode(item);
                node.setAttrs({ body: { id: `node-${item.id}` } });
                cells.push(node);
            }
        });
        return cells;
    };

    export function addCells(formattedItems) {
        const cells = createCells(formattedItems);
        if (graph) {
            graph.resetCells(cells);
            graph.zoomToFit({ padding: 10, maxScale: 1 });
        }
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
        if (graph) {
            graph.centerContent();
            graph.zoomToFit({
                padding: 20,
                maxScale: 2,
            });
        }
    }

    export function setBackground(color: string) {
        if (graph) {
            graph.drawBackground({
                color,
            });
        }
    }

    export function clearBackground() {
        if (graph) {
            graph.clearBackground();
        }
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
        if (graph) {
            graph.undo();
        }
    }

    export function redo() {
        if (graph) {
            graph.redo();
        }
    }

    export function clearGraph() {
        if (graph) {
            graph.clearCells();
        }
    }

    /* export function hideMinimap() {
        if (graph) {
            graph.disposePlugins("minimap");
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
    } */

    export function removeCells(cells) {
        if (graph) {
            graph.removeCells(cells);
        }
    }

    export function getJSONview() {
        if (graph) {
            return graph.toJSON();
        }
    }

    export function addDiagramFromJSON(data) {
        if (graph) {
            graph.fromJSON(data);
        }
    }
}
