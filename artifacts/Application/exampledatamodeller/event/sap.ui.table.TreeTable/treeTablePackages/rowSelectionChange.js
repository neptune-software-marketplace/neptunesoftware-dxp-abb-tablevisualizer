const selectedPackageIndex = treeTablePackages.getSelectedIndices();

const selectedRow = treeTablePackages.getRows()[selectedPackageIndex];
if (selectedRow) {
    const selectedPackage = selectedRow.getBindingContext().getObject();

    const packageTableIds = selectedPackage.children.map(item => item.id);
    if (packageTableIds.length) {
        tableModeller.displayTables(packageTableIds);
    }
}