const selectedTables = tableTables.getSelectedItems();
const selected = [];

selectedTables.forEach((table) => {
    const context = table.getBindingContext("tableModeller_AllTables");
    var tableData = context.getObject();
    //@ts-ignore
    selected.push(tableData.id);
});

tableModeller.displayTables(selected);
