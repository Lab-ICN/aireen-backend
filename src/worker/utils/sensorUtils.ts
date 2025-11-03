import type {SensorValueMap} from "../types/sensor.ts";

const KNOWN_SENSORS = ["ldr", "tds", "meta"] as const;

export function isKnownSensor(sensor: string): sensor is keyof SensorValueMap {
    return (KNOWN_SENSORS as readonly string[]).includes(sensor);
}