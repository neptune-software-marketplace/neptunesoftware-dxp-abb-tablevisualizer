interface GraphConfig {
    id?: string;
    height?: string;
    width?: string;
    nodeConfig: {
        name: string;
        overwrite: boolean;
        config: {};
    }[];
    connectionConfig: {};
    edgeConfig: { name: string; overwrite: boolean; config: {} }[];
    /*     edgeConfigName: string;
    overwriteEdge?: boolean; */
    portLayoutFunction?: ([]) => [];
    portLayoutName?: string;
    forcePortLayout?: boolean;
    minimap?: {
        container: HTMLElement;
        width?: number;
        height?: number;
        padding?: number;
        graphOptions?: {};
    };
}
