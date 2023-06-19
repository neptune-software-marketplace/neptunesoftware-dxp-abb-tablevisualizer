const selectedItem = listPackages.getSelectedItem();

if (selectedItem) {
    const context = selectedItem.getBindingContext('PackageTables');
    const data = context.getObject() as Package;

    textSelectedPackage.setText(data.name);
    textSelectedPackageDesc.setText(data.description);
    const table = data.tables.length === 1 ? 'table' : 'tables';
    textSelectedPackageNumber.setText(`(${data.tables.length} ${table})`)
} else {
    textSelectedPackageNumber.setText('');
}