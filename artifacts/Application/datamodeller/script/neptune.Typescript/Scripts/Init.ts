sap.ui.getCore().attachInit(function (startParams) {
    getTableData();
    tableModeller.init();
    modelSelected.setData({
        package: "",
        tables: [],
    });
    modelListTipsTricks.setData(tipsTricksListItems());
});

/* //@ts-ignore
if (sap.n) {
    //@ts-ignore
    sap.n.Shell.attachBeforeDisplay(function (startParams) {
        if (!tableModeller.graphIsRendered()) {
            tableModeller.init();
        }
    });
} */
