interface NeptuneTableColumn {
    fieldName: string;
    fieldType: string;
    id: string;
    description?: string;
    isUnique?: boolean;
    isNullable?: boolean;
}

interface NeptuneForeignKey {
    columns: {
        fieldName: string;
        fieldType: string;
        id: string;
        isUnique: boolean;
        referencedColumnId: string;
        referencedColumnName: string;
    }[];
    id: string;
    name: string;
    referencedTable: string;
    referencedTableColumns: NeptuneTableColumn[];
    referencedTableId: string;
}

interface NeptuneTableIndex {
    id: string;
    name: string;
    columns: {
        id: string;
        fieldName: string;
        fieldType: string;
    }[];
    isUnique: boolean;
}

interface NeptuneTable {
    changedBy: string;
    createdAt: string;
    createdBy: string;
    description: string | null;
    enableAudit: boolean;
    fields: NeptuneTableColumn[];
    foreignKeys: NeptuneForeignKey[];
    id: string;
    includeDataInPackage: boolean;
    indices: NeptuneTableIndex[];
    name: string;
    package: string | null;
    updatedAt: string;
    ver: string;
}

interface Package {
    changedBy: string;
    changedAt: string;
    createdAt: string;
    createdBy: string;
    description: string | null;
    enableCICD: boolean;
    git: {
        targetServers: [];
        testServers?: [];
        remote?: string;
        packageJSON?: string;
    };
    id: string;
    name: string;
    ver: string;
    tableModeller?: NeptuneTable[];
}