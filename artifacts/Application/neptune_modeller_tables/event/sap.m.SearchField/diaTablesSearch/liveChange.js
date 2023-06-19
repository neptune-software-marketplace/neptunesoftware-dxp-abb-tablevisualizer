const value = this.getValue();

const binding =
    tabDiaTables.getSelectedKey() === "tables"
        ? tableTables.getBinding("items")
        : listPackages.getBinding("items");

binding.filter([
    new sap.ui.model.Filter({
        filters: [
            new sap.ui.model.Filter("name", "Contains", value),
            new sap.ui.model.Filter("description", "Contains", value),
            new sap.ui.model.Filter("createdBy", "Contains", value),
        ],
        and: false,
    }),
]);
