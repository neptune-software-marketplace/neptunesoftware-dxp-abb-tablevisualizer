namespace Configuration {
    export const NODE_WIDTH = 300;
    export const LINE_HEIGHT = 24;

    export const nodes = [
        {
            name: "tableNode",
            overwrite: true,
            config: {
                //@ts-ignore
                inherit: "rect",
                markup: [
                    {
                        tagName: "rect",
                        selector: "body",
                    },
                    {
                        tagName: "text",
                        selector: "label",
                    },
                ],
                attrs: {
                    rect: {
                        strokeWidth: 1,
                        stroke: "var(--nepBrandYellow)",
                        fill: "var(--nepBrandYellow)",
                    },
                    label: {
                        fontWeight: "bold",
                        fill: "black",
                        fontSize: 14,
                    },
                },
                ports: {
                    groups: {
                        list: {
                            markup: [
                                {
                                    tagName: "rect",
                                    selector: "portBody",
                                },
                                {
                                    tagName: "text",
                                    selector: "portNameLabel",
                                },
                                {
                                    tagName: "text",
                                    selector: "portTypeLabel",
                                },
                                {
                                    tagName: "text",
                                    selector: "portProperties",
                                },
                            ],
                            attrs: {
                                portBody: {
                                    width: NODE_WIDTH,
                                    height: LINE_HEIGHT,
                                    strokeWidth: 1,
                                    stroke: "var(--nepBrandYellow)",
                                    fill: "#eff1f2",
                                    magnet: true,
                                },
                                portNameLabel: {
                                    ref: "portBody",
                                    refX: 6,
                                    refY: 6,
                                    fontSize: 12,
                                    textWrap: {
                                        width: "60%",
                                        ellipsis: true,
                                        breakWord: true,
                                    },
                                },
                                portTypeLabel: {
                                    ref: "portBody",
                                    refX: "65%",
                                    refY: 6,
                                    fontSize: 12,
                                },
                                portProperties: {
                                    ref: "portBody",
                                    refX: "92%",
                                    refY: 6,
                                    fontSize: 12,
                                },
                            },
                            position: "tablePortPosition",
                        },
                    },
                },
            },
        },
    ];

    export const edges = [
        {
            name: "variant",
            overwrite: true,
            config: {
                inherit: "edge",
                attrs: {
                    line: {
                        stroke: "var(--nepHighlightColor)",
                        strokeWidth: 2,
                    },
                },
                isCompositeKey: false,
            },
        },
        {
            name: "default",
            overwrite: true,
            config: {
                inherit: "edge",
                attrs: {
                    line: {
                        stroke: "var(--nepBrandYellow)",
                        strokeWidth: 2,
                    },
                },
                isCompositeKey: false,
            },
        },
    ];

    export const tablePortPosition = (portsPositionArgs) => {
        return portsPositionArgs.map((_, index) => {
            return {
                position: {
                    x: 0,
                    y: (index + 1) * 24,
                },
                angle: 0,
            };
        });
    };

    export const connection = {
        router: {
            name: "er",
            args: {
                offset: 0,
                direction: "H",
            },
        },
        allowBlank: false,
        allowNode: false,
        allowLoop: false,
        allowEdge: false,
        validateConnection: function (this, args) {
            if (args.sourceCell === args.targetCell) return false;
            const sourcePort = args.sourceCell.ports.items.find(
                (port) => port.id === args.sourcePort
            );
            const targetPort = args.targetCell.ports.items.find(
                (port) => port.id === args.targetPort
            );
            if (targetPort.isPrimary) return false;
            if (!sourcePort.isUnique) return false;
            if (sourcePort.dataType !== targetPort.dataType) return false;
            return true;
        },
        validateMagnet({ e, view, cell, magnet }) {
            const portId = magnet.parentElement.getAttribute("port");
            const port = cell.getPort(portId);
            if (!port.isUnique) return false;
            return true;
        },
    };

    export const btnDelete = {
        name: "button",
        args: {
            markup: [
                {
                    tagName: "circle",
                    selector: "button",
                    attrs: {
                        r: 12,
                        stroke: "var(--nepHighlightColor)",
                        fill: "var(--nepBaseColor)",
                        strokeWidth: 2,
                        cursor: "pointer",
                    },
                },
                {
                    tagName: "text",
                    textContent: "X",
                    selector: "icon",
                    attrs: {
                        fill: "var(--nepHighlightColor)",
                        fontSize: 10,
                        textAnchor: "middle",
                        pointerEvents: "none",
                        y: "0.3em",
                    },
                },
            ],
            distance: -35,
            onClick({ view }) {
                const edge = view.cell;
                ForeignKey.confirmRemove({ edge });
            },
        },
    };
}
