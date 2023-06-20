Tables.listTablesPackages();

const renderedTables = modelSelectedTablesFormatted.getData();
if (!modelSelectedTablesFormatted.length) {
    Tables.resetSelection();
    tabDiaTables.setSelectedKey('tables');
}