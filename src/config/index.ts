export const config = {
    port: Number(process.env.PORT) || 3000,
    mqtt: {
        url: process.env.MQTT_URL || "mqtt://localhost:1883",
    },
    influx: {
        url: process.env.INFLUX_URL || "http://localhost:8086",
        token: process.env.INFLUX_TOKEN || "your-token",
        org: process.env.INFLUX_ORG || "my-org",
        bucket: process.env.INFLUX_BUCKET || "sensor_data",
    },
};
