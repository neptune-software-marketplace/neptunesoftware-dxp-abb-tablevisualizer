const isPressed = butTablesToggleSelected.getPressed();

const binding = tableTables.getBinding("items");
const selectedItems = tableTables.getSelectedItems();

const filterTables = [];

if (isPressed) {
    butTablesToggleSelected.setText("Show all");
    butTablesToggleSelected.setIcon('sap-icon://multi-select')
    selectedItems.forEach((item) => {
        const itemName = item.getBindingContext("tableModeller_AllTables").getObject().name;
        const filter = new sap.ui.model.Filter("name", "EQ", itemName);
        filterTables.push(filter);
    });
} else {
    butTablesToggleSelected.setText("Show selected");
    butTablesToggleSelected.setIcon('sap-icon://multiselect-all')
}
binding.filter(filterTables);
