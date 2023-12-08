interface NeptuneTableColumn {
    id: string;
    fieldName: string;
    fieldType: string;
    description?: string;
    isUnique?: boolean;
    isNullable?: boolean;
}

interface NeptuneForeignKey {
    id: string;
    name: string;
    referencedTable: string;
    referencedTableId: string;
    referencedTableColumns: NeptuneTableColumn[];
    columns: {
        referencedColumnId: string;
        id: string;
        fieldName: string;
        fieldType: string;
        isUnique: boolean;
        referencedColumnName: string;
    }[];
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
    id: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    changedBy: string;
    fields: NeptuneTableColumn[];
    indices: NeptuneTableIndex[];
    foreignKeys: NeptuneForeignKey[];
    name: string;
    description: null | string;
    ver: string;
    enableAudit: boolean;
    includeDataInPackage: boolean;
    package: string | null;
    packageName?: string;
    rolesRead: any[];
    rolesWrite: any[];
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
    tables?: NeptuneTable[];
}


