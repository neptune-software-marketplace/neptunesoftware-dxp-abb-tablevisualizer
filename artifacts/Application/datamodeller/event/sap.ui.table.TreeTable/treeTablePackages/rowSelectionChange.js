const selectedPackageIndex = treeTablePackages.getSelectedIndices();

const selectedRow = treeTablePackages.getRows()[selectedPackageIndex];

btnClearSelectedPckg.setEnabled(!!selectedRow);

if (selectedRow && tableTables.getSelectedItems().length) {
    btnClearSelectedTables.firePress();
}

if (selectedRow) {
    const selectedPackage = selectedRow.getBindingContext().getObject();
    modelSelected.oData.package = selectedPackage.id;

    const packageTableIds = selectedPackage.children.map((item) => item.id);
    if (packageTableIds.length) {
        tableModeller.displayTables(packageTableIds);
    }
} else {
    tableModeller.clearGraph();
}
