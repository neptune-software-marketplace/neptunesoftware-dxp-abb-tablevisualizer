interface NeptuneTableColumn {
    id: string;
    fieldName: string;
    fieldType: string;
    description?: string;
    isUnique: boolean;
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

interface X6TablePort {
    id: string;
    group: string;
    columnId?: string;
    columnName?: string;
    isPrimary?: boolean;
    isUnique?: boolean;
    isNullable?: boolean;
    dataType: string;
    attrs: {
        portBody: {
            class: string;
        };
        portNameLabel: {
            text: string;
        };
        portProperties: {
            text: string;
        };
        portTypeLabel: {
            text: string;
        };
    };
}

interface X6Table {
    id: string;
    shape: string;
    label: string;
    width: number;
    height: number;
    attrs: {
        body: {
            class: string;
        };
        label: {
            fill: string;
        };
        text: {
            text: string;
        }
    }
    position: {
        x: number;
        y: number
    };
    ports: X6TablePort[];    
}

interface X6TableForeignKey {
    id: string;
    foreignKeyId: string;
    label?: string;
    shape: string;
    source: {
        cell: string;
        port: string;
    };
    target: {
        cell: string;
        port: string;
    };
    attrs: {
        line: {
            stroke: string;
            strokeWidth: number;
        };
    };
    zIndex: number;
}

