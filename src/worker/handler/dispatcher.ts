import { handleSystemMessage } from "./systemHandler";
import { handleSensorMessage } from "./sensorHandler";
import {logger} from "../../libs/logger.ts";

export async function dispatchMessage(topic: string, payload: string) {
    const parts = topic.split("/"); // ["aireen", "esp32", "1", "system", "uptime"]
    const nodeId = parts[2];        // "1"
    const category = parts[3];      // "system" atau "sensors"

    if (!nodeId || !category) {
        logger.warn({topic},"⚠️ Invalid topic format:");
        return;
    }

    switch (category) {
        case "system":
            await handleSystemMessage(nodeId, topic, payload);
            break;
        case "sensors":
            await handleSensorMessage(nodeId, topic, payload);
            break;
        default:
            logger.info(
                { nodeId, topic, payload },
                "Unhandled topic message received"
            );
    }
}
