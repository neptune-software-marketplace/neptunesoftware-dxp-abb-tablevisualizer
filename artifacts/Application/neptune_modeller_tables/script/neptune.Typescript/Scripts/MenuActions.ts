const tableMenuActions = [
    {
        text: "Hide table from view",
        action: () => {
            //@ts-ignore
            const tableId = textSourceId.getText();
            CustomComponent.removeCells([tableId]);
        },
        icon: "sap-icon://hide",
    },
    {
        text: "Definition",
        action: () => {
            //@ts-ignore
            const tableId = textSourceId.getText();

            if (tableId) {
                //@ts-ignore
                const table = modelSelectedTablesNeptune.getData().find((item) => item.id === tableId);
                const redirectDetails = {
                    target: {
                        semanticObject: "tools",
                        action: "tabledefinition",
                    },
                    params: {
                        id: tableId,
                        name: table.name,
                    }
                };

                //@ts-ignore
                sap.n.HashNavigation.toExternal(redirectDetails);
            }
        },
        icon: "sap-icon://fa-regular/folder-open",
    },
    {
        text: "Data Browser",
        action: () => {
            //@ts-ignore
            const tableId = textSourceId.getText();

            if (tableId) {
                //@ts-ignore
                const table = modelSelectedTablesNeptune.getData().find((item) => item.id === tableId);
                const redirectDetails = {
                    target: {
                        semanticObject: "tools",
                        action: "tablebrowser",
                    },
                    params: {
                        id: tableId,
                        name: table.name,
                    }
                };

                //@ts-ignore
                sap.n.HashNavigation.toExternal(redirectDetails);
            }
        },
        icon: "sap-icon://fa-regular/folder-open",
    },
];
