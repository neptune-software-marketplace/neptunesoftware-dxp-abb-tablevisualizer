function filterTables() {
    const searchValue = searchTables.getValue();
    const showSelected = butTablesToggleSelected.getPressed();
    const binding = tableTables.getBinding("items");

    const andFilter = [];

    if (searchValue) {
        andFilter.push(
            new sap.ui.model.Filter({
                filters: [
                    new sap.ui.model.Filter(
                        "name",
                        sap.ui.model.FilterOperator.Contains,
                        searchValue
                    ),
                    new sap.ui.model.Filter(
                        "description",
                        sap.ui.model.FilterOperator.Contains,
                        searchValue
                    ),
                    new sap.ui.model.Filter(
                        "createdBy",
                        sap.ui.model.FilterOperator.Contains,
                        searchValue
                    ),
                ],
                //@ts-ignore
                and: false,
            })
        );
    }

    //@ts-ignore
    const selectedTables = modelSelected.oData.tables;

    if (showSelected) {
        butTablesToggleSelected.setText("Show all");
        butTablesToggleSelected.setIcon("sap-icon://multi-select");

        const selectedFilters = [];
        selectedTables.forEach((item) => {
            const filter = new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, item);
            selectedFilters.push(filter);
        });
        andFilter.push(
            new sap.ui.model.Filter({
                filters: selectedFilters,
                and: false,
            })
        );
    } else {
        butTablesToggleSelected.setText("Show selected");
        butTablesToggleSelected.setIcon("sap-icon://multiselect-all");
    }

    if (andFilter.length > 0) {
        //@ts-ignore
        binding.filter(new sap.ui.model.Filter(andFilter, true));
    } else {
        //@ts-ignore
        binding.filter([]);
    }
}

function filterPackages() {
    const searchValue = searchPackage.getValue();
    const binding = treeTablePackages.getBinding("rows");

    //@ts-ignore
    binding.filter([
        new sap.ui.model.Filter({
            filters: [
                new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, searchValue),
                new sap.ui.model.Filter(
                    "description",
                    sap.ui.model.FilterOperator.Contains,
                    searchValue
                ),
            ],
            and: false,
        }),
    ]);

    treeTablePackages.expandToLevel(99);
}
