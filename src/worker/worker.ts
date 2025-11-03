import { mqttClient } from "../libs/mqtt";
import { logger } from "../libs/logger";
import { dispatchMessage } from "./handler/dispatcher";

export async function startWorker() {
    logger.info("👷 Worker started...");

    const topic = "aireen/esp32/#";

    mqttClient.on("connect", () => {
        logger.info("✅ Connected to MQTT broker");
        mqttClient.subscribe(topic, (err) => {
            if (err) logger.error({ err }, "Failed to subscribe");
            else logger.info({ topic }, "Subscribed to topic");
        });
    });

    mqttClient.on("message", async (topic, payload) => {
        const message = payload.toString();
        logger.debug({ topic, message }, "Message received");

        try {
            await dispatchMessage(topic, message);
        } catch (err) {
            logger.error({ err, topic }, "Error handling message");
        }
    });

    process.on("SIGINT", () => {
        logger.warn("🛑 Worker shutting down...");
        mqttClient.end();
        process.exit(0);
    });
}
