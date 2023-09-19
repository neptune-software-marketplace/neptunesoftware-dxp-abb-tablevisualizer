const selectedTables = modeltableModeller_AllTables.getData().forEach((item) => item.selected = false);
tableTables.fireSelectionChange();
butTablesToggleSelected.setPressed(false);
butTablesToggleSelected.firePress();