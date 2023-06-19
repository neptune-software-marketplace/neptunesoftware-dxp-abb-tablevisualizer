namespace Tables {
    export async function listTablesPackages() {
        const tableData = await getTableList();
        const allTables: NeptuneTable[] = tableData.dictionary;
        const allPackages = await getPackageList();

        allTables.forEach((table) => {
            const tablePackageIndex = allPackages.findIndex((x) => x.id === table.package);
            if (tablePackageIndex === -1) return;
            if (!allPackages[tablePackageIndex].hasOwnProperty("tables")) {
                allPackages[tablePackageIndex].tables = [];
            }
            allPackages[tablePackageIndex].tables.push(table);
        });

        const packagesWithTables = allPackages
            .filter((x) => x.tables)
            .sort((a, b) => {
                let ta = a.name.toLowerCase(),
                    tb = b.name.toLowerCase();

                if (ta < tb) {
                    return -1;
                }
                if (ta > tb) {
                    return 1;
                }
                return 0;
            });

        modeltableTables.setData(allTables);
        modeltableTables.setSizeLimit(1000);
        tabTables.setCount(allTables.length.toString());

        segmentedBtnSort.setSelectedKey("changedOn");
        segmentedButtonUpdated.firePress();

        modelPackageTables.setData(packagesWithTables);
        tabPackages.setCount(packagesWithTables.length.toString());
    }

    export function getSelectedIds(): string[] {
        let selectedTables = tableTables.getSelectedItems();
        const tableIds = [];

        const getItemDetails = (selectedItem) => {
            const context = selectedItem.getBindingContext();
            return context.getObject();
        };

        if (selectedTables.length) {
            selectedTables.forEach((table) => {
                const tableData = getItemDetails(table);

                tableIds.push(tableData.id);
            });
        }

        if (!selectedTables.length) {
            const selectedPackage = listPackages.getSelectedItem();
            if (selectedPackage) {
                const context = selectedPackage.getBindingContext('PackageTables');
                const data = context.getObject();
                //@ts-ignore
                const packageTables = data.tables;
                packageTables.forEach((table) => {
                    tableIds.push(table.id);
                });
            }
        }

        return tableIds;
    }

    export function sort(column: string, table, descending = true) {
        const oSorter = new sap.ui.model.Sorter(column, descending, false);
        const binding = table.getBinding("items");
        binding.sort(oSorter);
    }

    export function resetSelection(currentTab = "all") {
        const resetPackageTab = () => {
            listPackages.removeSelections(true);
            textSelectedPackage.setText("You haven't selected a package yet.");
            textSelectedPackageDesc.setText("");
            textSelectedPackageNumber.setText("");
        };

        const resetTableTab = () => {
            tableTables.removeSelections(true);
            modellistSelectedTables.setData([]);
        };

        if (currentTab === "packages" || currentTab === 'all') {
            resetTableTab();
        }
        
        if (currentTab === "tables" || currentTab === 'all') {
            resetPackageTab();
        } 
        
    }
}
