Tables.listTablesPackages();

const renderedTables = modelFormattedTables.getData();
if (!modelFormattedTables.length) {
    Tables.resetSelection();
    tabDiaTables.setSelectedKey('tables');
}