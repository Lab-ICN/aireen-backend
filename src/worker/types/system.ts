import type { ParsedPayload } from "./payload";

export interface SystemMessage {
    nodeId: string;
    topic: string;
    metric: string;
    value: ParsedPayload;
    valueType: string;
}
