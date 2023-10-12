tableModeller.clearGraph();
tableModeller.resetChanges();

tableTables.removeSelections();
modelSelected.setData([])
tableTables.fireSelectionChange();
treeTablePackages.clearSelection();
treeTablePackages.fireRowSelectionChange();

switchFullscreen.setState(false);
switchFullscreen.fireChange();

