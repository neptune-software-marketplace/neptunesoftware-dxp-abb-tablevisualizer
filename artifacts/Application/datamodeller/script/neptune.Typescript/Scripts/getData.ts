async function getTableData() {
    const data = await Tables.listTablesPackages();
    const treePackageData = Tables.buildPackageTree(data.packagesWithTables);
    modeltreeTablePackages.setData(treePackageData);
    Tables.sort('updatedAt', tableTables);
}