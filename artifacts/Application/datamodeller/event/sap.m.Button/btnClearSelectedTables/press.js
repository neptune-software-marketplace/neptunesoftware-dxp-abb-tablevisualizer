const selectedTables = modeltableModeller_AllTables.getData().forEach((item) => item.selected = false);
modeltableModeller_AllTables.refresh(true);
tableTables.fireSelectionChange();
butTablesToggleSelected.setPressed(false);
butTablesToggleSelected.firePress();