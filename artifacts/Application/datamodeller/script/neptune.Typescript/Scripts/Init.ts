sap.ui.getCore().attachInit(async function (startParams) {
    getTableData();
    tableModeller.init();
    modelSelected.setData({
        package: '',
        tables: []
    })
});
