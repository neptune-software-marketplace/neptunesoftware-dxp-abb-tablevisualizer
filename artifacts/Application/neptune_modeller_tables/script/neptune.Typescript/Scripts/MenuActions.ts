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
            let path = "/cockpit.html#tools-tabledefinition";
            //@ts-ignore
            const tableId = textSourceId.getText();

            if (tableId) {
                //@ts-ignore
                const table = modelNeptuneTables.oData.find(item => item.id === tableId);
                const parameters = encodeURIComponent(
                    JSON.stringify({
                        id: tableId,
                        name: table.name,
                    })
                );
                path += `&${parameters}`;
            }

            sap.m.URLHelper.redirect(path, false);
        },
        icon: "sap-icon://fa-regular/folder-open",
    },
    /* {
        text: "Data Browser",
        action: () => {
            let path = "/cockpit.html#tools-tablebrowser";
            //@ts-ignore
            const tableId = textSourceId.getText();

            if (tableId) {
                //@ts-ignore
                const table = modelNeptuneTables.oData.find(item => item.id === tableId);
                const parameters = encodeURIComponent(
                    JSON.stringify({
                        id: tableId,
                        name: table.name,
                    })
                );
                path += `&${parameters}`;
            }

            sap.m.URLHelper.redirect(path, false);
        },
        icon: "sap-icon://fa-regular/folder-open",
    }, */
];
