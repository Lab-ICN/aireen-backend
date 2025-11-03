import { InfluxDB, Point } from "@influxdata/influxdb-client";
import { config } from "../config";
import { logger } from "./logger";

const influx = new InfluxDB({
    url: config.influx.url,
    token: config.influx.token,
});

const writeApi = influx.getWriteApi(config.influx.org, config.influx.bucket, "ns");
writeApi.useDefaultTags({ app: "aireen-worker" });

export async function writeSensorPoint(nodeId: string, sensor: string, value: number | object) {
    try {
        const point = new Point("sensor_data")
            .tag("node_id", nodeId)
            .tag("sensor", sensor)
            .timestamp(new Date());

        if (typeof value === "number") {
            point.floatField("value", value);
        } else if (typeof value === "object") {
            for (const [key, val] of Object.entries(value)) {
                if (typeof val === "number") point.floatField(key, val);
                else point.stringField(key, String(val));
            }
        } else {
            point.stringField("value", String(value));
        }

        writeApi.writePoint(point);
    } catch (err) {
        logger.error({ err, nodeId, sensor }, "❌ Failed to write Influx point");
    }
}

export async function writeSystemPoint(nodeId: string, metric: string, value: number | string) {
    const point = new Point("system_data")
        .tag("node_id", nodeId)
        .tag("metric", metric)
        .floatField("value", Number(value))
        .timestamp(new Date());

    const writeApi = influx.getWriteApi("your-org", "prototype2025");
    writeApi.writePoint(point);
    await writeApi.close();
}

export async function flushInflux() {
    try {
        await writeApi.close();
        logger.info("✅ Influx write API closed cleanly");
    } catch (err) {
        logger.error({ err }, "❌ Error closing Influx write API");
    }
}
