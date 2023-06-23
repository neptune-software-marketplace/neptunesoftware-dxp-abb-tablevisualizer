sap.ui.getCore().attachInit(async function (startParams) {
    const data = await Tables.listTablesPackages();
    const treePackageData = Tables.buildPackageTree(data.packagesWithTables);
    modeltreeTablePackages.setData(treePackageData);
    //tableModeller.init();
});