import mqtt from "mqtt";
import { config } from "../config";

export const mqttClient = mqtt.connect(config.mqtt.url);

mqttClient.on("connect", () => {
    console.log("📡 MQTT connected:", config.mqtt.url);
});

mqttClient.on("error", (err) => {
    console.error("❌ MQTT error:", err);
});
