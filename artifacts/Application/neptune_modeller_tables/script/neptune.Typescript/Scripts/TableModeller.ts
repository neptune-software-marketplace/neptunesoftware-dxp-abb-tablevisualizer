namespace TableModeller {
    const NODE_WIDTH = 300;
    const LINE_HEIGHT = 24;

    const isX6Table = (obj: any): obj is X6Table => {
        return "ports" in obj && obj["shape"] === "tableNode";
    };

    export function formatTablesToX6(tableArray: NeptuneTable[]) {
        let formattedData: (X6Table | X6TableForeignKey)[] = [];

        tableArray.forEach((table, index) => {
            let formattedTable = {} as X6Table;

            const positionX = index === 0 ? 300 : 300 * (index + 1);
            const positionY = index === 0 ? 0 : 100 * (index + 1);

            formattedTable.id = table.id;
            formattedTable.shape = "tableNode";
            formattedTable.label = table.name;
            formattedTable.width = 300;
            formattedTable.height = 24;
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
                group: "list",
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
                    portPrimaryKey: {
                        text: "P",
                    },
                },
            });

            // add rest of table columns
            table.fields.forEach((field, x) => {
                const isPrimaryKey = field.isUnique && !field.isNullable;

                formattedTable.ports.push({
                    id: `${index + 1}-${x + 2}`,
                    group: "list",
                    attrs: {
                        portBody: {
                            class: isPrimaryKey ? "x6PrimaryKey" : "x6ConnectorLine",
                        },
                        portNameLabel: {
                            text: field.fieldName,
                        },
                        portTypeLabel: {
                            text: field.fieldType,
                        },
                        portPrimaryKey: {
                            text: isPrimaryKey ? "P" : " ",
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
                        formattedLink.shape = "tableEdge";

                        const isCompositeKey = key.columns.length > 1;
                        if (isCompositeKey) {
                            formattedLink.label = `FK ${index + 1}`;
                        }

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
                                    stroke: 'var(--nepHighlightColor)',
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

    export const nodeConfig = {
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
                stroke: 'var(--nepBrandYellow)',
                fill: 'var(--nepBrandYellow)',
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
                            selector: "portPrimaryKey",
                        },
                    ],
                    attrs: {
                        portBody: {
                            width: NODE_WIDTH,
                            height: LINE_HEIGHT,
                            strokeWidth: 1,
                            stroke: 'var(--nepBrandYellow)',
                            fill: '#eff1f2',
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
                        portPrimaryKey: {
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
    };

    export const edgeConfig = {
        inherit: "edge",
        attrs: {
            line: {
                stroke: 'var(--nepHighlightColor)',
                strokeWidth: 2,
            },
        },
    };

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

    export const connectionConfig = {
        router: {
            name: "er",
            args: {
                offset: 25,
                direction: "H",
            },
        },
        allowBlank: false,
        allowNode: false,
        allowLoop: false,
        allowEdge: false,
        validateConnection: function (this, args) {
            if (args.sourceCell === args.targetCell) return false
            return true
        },
        createEdge() {
            return graphCore.graph.createEdge({
                shape: 'edge',
                attrs: {
                    line: {
                        stroke: 'var(--nepHighlightColor)',
                        strokeWidth: 2,
                    }
                }
            })
        }
    };

}