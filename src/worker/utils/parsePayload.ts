import type { ParsedPayload } from "../types/payload";
import type { SensorValueMap } from "../types/sensor";
import type { SystemValueMap } from "../types/system.ts";

export function parsePayload(raw: string): ParsedPayload {
    const trimmed = raw.trim();

    if (!trimmed) return "";
    if (!isNaN(Number(trimmed))) return Number(trimmed);
    if (trimmed === "true" || trimmed === "false") return trimmed === "true";

    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        try {
            return JSON.parse(trimmed);
        } catch {
            return trimmed;
        }
    }

    return trimmed;
}

export function inferSensorValue<S extends keyof SensorValueMap>(
    sensor: S,
    raw: string
): SensorValueMap[S] {
    const parsed = parsePayload(raw);
    switch (sensor) {
        case "ldr":
        case "tds":
        // case "temp":
        // case "ph":
            return Number(parsed) as SensorValueMap[S];
        case "meta":
            return (typeof parsed === "object" ? parsed : {}) as SensorValueMap[S];
        default:
            return parsed as SensorValueMap[S];
    }
}

export function inferSystemValue<M extends keyof SystemValueMap>(
    metric: M,
    raw: string
): SystemValueMap[M] {
    const parsed = parsePayload(raw);

    switch (metric) {
        case "rssi":
        case "heap":
        case "uptime":
            return Number(parsed) as SystemValueMap[M];

        case "meta":
            // data kompleks berbentuk objek
            return (typeof parsed === "object" ? parsed : {}) as SystemValueMap[M];

        default:
            // fallback untuk metric lain
            return parsed as SystemValueMap[M];
    }
}