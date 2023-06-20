namespace Tables {
    export async function listTablesPackages() {
        const data = await getTableList();

        const allTables: NeptuneTable[] = data.dictionary;
        const allPackages = data.package;

        allTables
            .filter((table) => allPackages.some((package) => package.id === table.package))
            .forEach((table) => {
                const package = allPackages.find((package) => package.id === table.package);
                package.tables = package.tables || [];
                package.tables.push(table);
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

        modelAllTables.setData(allTables);
        modelAllPackages.setData(packagesWithTables);

        segmentedBtnSort.setSelectedKey("changedOn");
        segmentedButtonUpdated.firePress();
    }

    export function getSelectedIds(): string[] {
        let selectedTables = tableTables.getSelectedItems();
        const tableIds = [];

        const getItemDetails = (selectedItem) =>
            selectedItem.getBindingContext("AllTables").getObject();

        if (selectedTables.length) {
            selectedTables.forEach((table) => {
                const tableData = getItemDetails(table);

                tableIds.push(tableData.id);
            });
        }

        if (!selectedTables.length) {
            const selectedPackage = listPackages.getSelectedItem();
            if (selectedPackage) {
                const context = selectedPackage.getBindingContext("AllPackages");
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
        if (currentTab === "packages") {
            tableTables.removeSelections(true);
            modellistSelectedTables.setData([]);
        } else if (currentTab === "tables") {
            listPackages.removeSelections(true);
            listPackages.fireSelectionChange();
        } else {
            tableTables.removeSelections(true);
            modellistSelectedTables.setData([]);

            listPackages.removeSelections(true);
            listPackages.fireSelectionChange();
        }
    }
}
