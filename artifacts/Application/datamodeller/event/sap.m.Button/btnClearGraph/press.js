tableModeller.clearGraph();
tableModeller.resetChanges();

tableTables.removeSelections();
modelSelected.setData([])
tableTables.fireSelectionChange();
treeTablePackages.clearSelection();
treeTablePackages.fireRowSelectionChange();

butMenuToggleSide.setPressed(true);
butMenuToggleSide.firePress();

