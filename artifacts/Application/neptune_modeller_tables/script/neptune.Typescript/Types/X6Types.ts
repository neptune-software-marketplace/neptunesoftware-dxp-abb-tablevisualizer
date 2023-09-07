
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
    isCompositeKey?: boolean;
}