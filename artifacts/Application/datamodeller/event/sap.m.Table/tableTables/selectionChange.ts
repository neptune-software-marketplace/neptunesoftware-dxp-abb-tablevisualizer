tabBarTableSelection.setBusy(true);

const selectedTables = modeltableModeller_AllTables.getData().filter((item) => item.selected);

const hasSelection = !!selectedTables.length;
butTablesToggleSelected.setEnabled(hasSelection);
btnClearSelectedTables.setEnabled(hasSelection);

if (hasSelection && treeTablePackages.getSelectedIndices().length) {
    modelSelected.getData().package = "";
    modelSelected.refresh(true);
    tableModeller.clearGraph();
}

const selectedIds = selectedTables.map((table) => table.id);

const currentlySelected = modelSelected.getData();

currentlySelected.tables = selectedIds;
modelSelected.refresh(true);

filterTables();

tableModeller
    .displayTables(currentlySelected.tables)
    .then((data) => tabBarTableSelection.setBusy(false));

if (!selectedIds.length) {
    butTablesToggleSelected.setPressed(false);
    butTablesToggleSelected.firePress();
}
