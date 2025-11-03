export type ParsedPayload = string | number | boolean | object;

export interface ParsedMessage {
    nodeId: string;
    topic: string;
    sensor: string;
    value: ParsedPayload;
    valueType: string;
}
