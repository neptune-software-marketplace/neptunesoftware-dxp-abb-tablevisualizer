async function fetchData(url: string, data = {}) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw response;
    }

    return await response.json();
}

async function getTableList() {
    const tables = await fetchData("/api/functions/Dictionary/List");
    return tables;
}

async function getPackageList() {
    const packages = await fetchData("/api/functions/Package/List");
    return packages;
}

async function getTable(tableId: string) {
    const table = fetchData("/api/functions/Dictionary/Get", { id: tableId });
    return table;
}
