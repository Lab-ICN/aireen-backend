import { logger } from "../../libs/logger";
import { inferSensorValue } from "../utils/parsePayload";
import type {SensorMessage, SensorValueMap} from "../types/sensor.ts";
import {isKnownSensor} from "../utils/sensorUtils.ts";
import {writeSensorPoint} from "../../libs/influx.ts";

export async function handleSensorMessage(
    nodeId: string,
    topic: string,
    raw: string
) {
    const sensor = (topic.split("/").pop() ?? "unknown") as keyof SensorValueMap;

    if (!isKnownSensor(sensor)) {
        logger.warn({ nodeId, topic, sensor }, "⚠️ Unknown sensor type");
        return;
    }

    const payload = inferSensorValue(sensor, raw);

    const message: SensorMessage<typeof sensor> = {
        nodeId,
        topic,
        sensor,
        value: payload,
        valueType: typeof payload,
    };

    await writeSensorPoint(nodeId, sensor, message.value);

    logger.info(message, `🌡️ [Node ${nodeId}] Sensor ${sensor} = ${payload}`);
}
