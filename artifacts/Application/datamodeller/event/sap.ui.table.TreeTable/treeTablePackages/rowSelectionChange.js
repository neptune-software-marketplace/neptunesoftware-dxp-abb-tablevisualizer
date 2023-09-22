const context = oEvent.getParameter("rowContext");

if (!context) {
    return;
}

const selectedPackage = context.getObject();

if (selectedPackage.parent) {
    return;
}

if (selectedPackage && tableTables.getSelectedItems().length) {
    btnClearSelectedTables.firePress();
}

if (selectedPackage) {
    modelSelected.getData().package = selectedPackage.id;
    modelSelected.refresh(true);

    const packageTableIds = selectedPackage.children.map((item) => item.id);
    if (packageTableIds.length) {
        tableModeller.displayTables(packageTableIds);
    }
} else {
    modelSelected.getData().package = "";
    modelSelected.refresh(true);
    tableModeller.clearGraph();
}
