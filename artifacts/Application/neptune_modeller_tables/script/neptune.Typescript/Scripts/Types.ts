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
    tables?: NeptuneTable[];
}

interface X6TablePort {
    id: string;
    group: string;
    attrs: {
        portBody: {
            class: string;
        };
        portNameLabel: {
            text: string;
        };
        portPrimaryKey: {
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

