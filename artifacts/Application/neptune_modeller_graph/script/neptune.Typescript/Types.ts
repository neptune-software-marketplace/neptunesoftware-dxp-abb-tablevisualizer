interface GraphConfig {
    nodeConfig: {};
    nodeConfigName: string;
    connectionConfig: {};
    edgeConfig: {};
    edgeConfigName: string;
    overwriteNode?: boolean;
    overwriteEdge?: boolean;
    portLayoutFunction?: ([]) => [];
    portLayoutName?: string;
    forcePortLayout?: boolean;
}