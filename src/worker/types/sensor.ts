
export interface SensorValueMap {
    ldr: number;
    tds: number;
    meta: Record<string, any>;
}

export interface SensorMessage<S extends keyof SensorValueMap = keyof SensorValueMap> {
    nodeId: string;
    topic: string;
    sensor: S;
    value: SensorValueMap[S];
    valueType: string;
}