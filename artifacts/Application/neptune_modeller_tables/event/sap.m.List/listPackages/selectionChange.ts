const selectedItem = listPackages.getSelectedItem();

if (selectedItem) {
    const context = selectedItem.getBindingContext("AllPackages");
    const data = context.getObject() as Package;

    textSelectedPackage.setText(data.name);
    textSelectedPackageDesc.setText(data.description);
    const table = data.tables.length === 1 ? "table" : "tables";
    textSelectedPackageNumber.setText(`(${data.tables.length} ${table})`);
} else {
    textSelectedPackage.setText("You haven't selected a package yet.");
    textSelectedPackageDesc.setText("");
    textSelectedPackageNumber.setText("");
}
