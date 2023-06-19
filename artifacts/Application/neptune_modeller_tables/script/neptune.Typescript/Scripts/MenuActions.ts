const tableMenuActions = [
    {
        text: "Hide table from view",
        action: () => {
            const tableId = textSourceId.getText();
            CustomComponent.removeCells([tableId]);
        },
        icon: "sap-icon://hide",
    },
    {
        text: "Definition",
        action: () => {
            let path = "/cockpit.html#tools-tabledefinition";
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

            sap.m.URLHelper.redirect(path, true);
        },
        icon: "sap-icon://fa-regular/folder-open",
    },
    {
        text: "Data Browser",
        action: () => {
            let path = "/cockpit.html#tools-tablebrowser";
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

            sap.m.URLHelper.redirect(path, true);
        },
        icon: "sap-icon://fa-regular/folder-open",
    },
];
