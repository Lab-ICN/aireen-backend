export interface SystemValueMap {
    rssi: number;
    heap: number;
    uptime: number;
    meta: Record<string, any>;
}

export interface SystemMessage<M extends keyof SystemValueMap = keyof SystemValueMap> {
    nodeId: string;
    topic: string;
    metric: M;
    value: SystemValueMap[M];
    valueType: string;
}
