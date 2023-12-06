await getTableData();

const selectedPackage = modelSelected.getData().package;
if (!selectedPackage) {
    return;
}
const package = modeltableModeller_AllPackages
    .getData()
    .find((item) => item.id === selectedPackage);
if (!package) {
    return;
}
const packageTableIds = package.tables.map((item) => item.id);
if (!packageTableIds.length) {
    return;
}
tableModeller.displayTables(packageTableIds);