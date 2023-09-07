namespace CustomComponent {
    let Graph = null;
    let MiniMap = null;
    let Stencil = null;
    let Shape = null;
    let graph = null;
    let stencilDrawer = null;
    let nodeConfigNames = [];
    let edgeConfigNames = [];
    let portLayoutName: string;

    export function graphExists() {
        return graph !== null;
    }
    //let minimapContainer;

    async function checkGetX6Object() {
        return new Promise((resolve, reject) => {
            const checkExistence = () => {
                if (typeof getX6Object === "function") {
                    resolve(getX6Object());
                } else {
                    setTimeout(checkExistence, 10);
                }
            };

            checkExistence();
        });
    }

    export async function init(container: HTMLDivElement, graphConfig: GraphConfig) {
        const containerDiv = container;

        const X6Objects = await checkGetX6Object();
        //@ts-ignore
        Graph = X6Objects.Graph;
        //@ts-ignore
        MiniMap = X6Objects.MiniMap;
        //@ts-ignore
        Stencil = X6Objects.Stencil;
        //@ts-ignore
        Shape = X6Objects.Shape;

        if (graph) {
            destroy();
        }

        graphConfig.connectionConfig;

        graph = new Graph({
            container: containerDiv,
            connecting: {
                ...graphConfig.connectionConfig,
                createEdge() {
                    return new Shape.Edge(graphConfig.edgeConfig[0].config);
                },
            },
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

        graphConfig.nodeConfig.forEach((node) => {
            Graph.registerNode(node.name, node.config, node.overwrite);
            nodeConfigNames.push(node.name);
        });

        graphConfig.edgeConfig.forEach((edge) => {
            Graph.registerEdge(
                edge.name,
                //@ts-ignore
                edge.config,
                edge.overwrite
            );
            edgeConfigNames.push(edge.name);
        });

        graph.use(
            //@ts-ignore
            new X6Objects.History({
                enabled: true,
            })
        );

        if (graphConfig.minimap) {
            graph.use(
                new MiniMap({
                    container: graphConfig.minimap.container,
                    width: graphConfig.minimap.width ?? 200,
                    height: graphConfig.minimap.height ?? 160,
                    padding: graphConfig.minimap.padding ?? 10,
                })
            );
        }

        return graph;
    }

    export function destroy() {
        nodeConfigNames.forEach((node) => {
            Graph.unregisterNode(node);
        });
        edgeConfigNames.forEach((edge) => {
            Graph.unregisterNode(edge);
        });
        if (portLayoutName) {
            Graph.unregisterPortLayout(portLayoutName);
        }
        if (graph) {
            graph.dispose();
            graph = null;
        }
    }

    export function initStencil(options) {
        if (graph) {
            options.target = graph;
            stencilDrawer = new Stencil(options);
            return stencilDrawer;
        }
    }

    /* export function destroyStencil() {
        if (stencilDrawer) {

        }
    } */

    const createCells = (items) => {
        const cells = [];
        items.forEach((item) => {
            const shortenedId = item.id.replace(/-\w+$/, "");
            if ("source" in item) {
                const edge = graph.createEdge(item);
                edge.setAttrs({ line: { id: `edge-${shortenedId}` } });
                cells.push(edge);
            } else {
                const node = createNode(item);
                node.setAttrs({ body: { id: `node-${shortenedId}` } });
                cells.push(node);
            }
        });
        return cells;
    };

    export function createNode(config) {
        return graph.createNode(config);
    }

    export function addNode(node) {
        if (graph) {
            graph.addNode(node);
        }
    }

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

    export function resetGraph(nodes = null) {
        if (graph) {
            if (!nodes) {
                graph.clearCells({ silent: false });
            } else {
                graph.resetCells(nodes, { silent: false });
            }
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

    export function removeCells(cells: []) {
        if (!graph) return;
        graph.removeCells(cells);
    }

    export function getJSONview() {
        if (!graph) return;
        return graph.toJSON();
    }

    export function addDiagramFromJSON(data) {
        if (!graph) return;
        graph.fromJSON(data);
    }

    export function getCells() {
        if (!graph) return;
        return { edges: graph.getEdges(), nodes: graph.getNodes(), allCells: graph.getCells() };
    }

    export function zoomOut() {
        if (!graph) return;
        graph.zoom(-0.2);
    }

    export function zoomIn() {
        if (!graph) return;
        graph.zoom(0.2);
    }
}
