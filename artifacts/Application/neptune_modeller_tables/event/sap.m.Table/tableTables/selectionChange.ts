const selectedTables = tableTables.getSelectedItems();

if (selectedTables.length === 1) {
    btnGetConnectedTables.setEnabled(true);
} else {
    btnGetConnectedTables.setEnabled(false);
}

const selected = [];

selectedTables.forEach(table => {
    const context = table.getBindingContext();
    var tableData = context.getObject();
    selected.push(tableData);
});

modellistSelectedTables.setData(selected);