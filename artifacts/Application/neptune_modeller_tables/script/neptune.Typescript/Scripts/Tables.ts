namespace Tables {
    export async function listTablesPackages() {
        const data = await getTableList();

        const allTables: NeptuneTable[] = data.dictionary;
        const allPackages = data.package;

        allTables
            .forEach((table) => {
                const package = allPackages.find((package) => package.id === table.package);
                if (package) {
                    table.packageName = package.name;
                    package.tables = package.tables || [];
                    package.tables.push(table);
                }
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
        return { allTables, packagesWithTables };
    }

    export function sort(column: string, table, descending = true) {
        const oSorter = new sap.ui.model.Sorter(column, descending, false);
        const binding = table.getBinding("items");
        binding.sort(oSorter);
    }

    export function buildPackageTree(packages) {
        const treeData = [];

        packages.forEach((item) => {
            treeData.push({
                name: item.name,
                description: item.description,
                tableCount: item.tables.length,
                updatedAt: item.updatedAt,
                changedBy: item.changedBy,
                id: item.id,
                parent: "",
                design: 'Bold',
                action: true,
            });
            item.tables.forEach((table) => {
                treeData.push({
                    name: table.name,
                    description: table.description,
                    id: table.id,
                    updatedAt: table.updatedAt,
                    changedBy: table.changedBy,
                    parent: item.id,
                    parentName: item.name,
                    parentDesc: item.description,
                    action: false,
                });
            });
        });

        const nestedTree = { children: _convertFlatToNested(treeData, "id", "parent") };
        return nestedTree;
    }
}
