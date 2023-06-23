const selectedTables = tableTables.getSelectedItems();

const hasSelection = selectedTables.length > 0;
butTablesToggleSelected.setEnabled(hasSelection);
butTablesToggleSelected.firePress();
btnClearSelected.setEnabled(hasSelection);

const selected = [];

selectedTables.forEach((table) => {
    const context = table.getBindingContext("tableModeller_AllTables");
    var tableData = context.getObject();
    //@ts-ignore
    selected.push(tableData.id);
});

tableModeller.displayTables(selected);

