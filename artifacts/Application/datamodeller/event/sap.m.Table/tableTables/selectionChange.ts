const selectedTables = tableTables.getSelectedItems();

const hasSelection = selectedTables.length > 0;
butTablesToggleSelected.setEnabled(hasSelection);
btnClearSelectedTables.setEnabled(hasSelection);

if (hasSelection && treeTablePackages.getSelectedIndices().length) {
    btnClearSelectedPckg.firePress();
}

const selected = [];
selectedTables.forEach((table) => {
    const context = table.getBindingContext("tableModeller_AllTables");
    const tableData = context.getObject();
    //@ts-ignore
    selected.push(tableData.id);
});
//@ts-ignore
modelSelected.oData.tables = selected;

tableModeller.displayTables(selected);
