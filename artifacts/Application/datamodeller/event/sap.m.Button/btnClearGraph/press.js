tableModeller.clearGraph();
tableModeller.resetChanges();

tableTables.removeSelections();
tableTables.fireSelectionChange();
treeTablePackages.clearSelection();
treeTablePackages.fireRowSelectionChange();

butMenuToggleSide.setPressed(true);
butMenuToggleSide.firePress();

