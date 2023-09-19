sap.ui.getCore().attachInit(function (startParams) {
    getTableData();
    tableModeller.init();
    modelSelected.setData({
        package: "",
        tables: [],
    });
    modelListTipsTricks.setData(tipsTricksListItems());
    modelListLegend.setData(legendListItems());
});
