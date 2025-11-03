import { logger } from "../../libs/logger";
import {inferSystemValue, parsePayload} from "../utils/parsePayload";
import type { SystemMessage } from "../types/system.ts";
import { isKnownSystemMetric } from "../utils/systemUtils.ts";
import { writeSystemPoint } from "../../libs/influx.ts";

export async function handleSystemMessage(
    nodeId: string,
    topic: string,
    raw: string
) {
    const metric = (topic.split("/").pop() ?? "unknown") as SystemMessage["metric"];

    if (!isKnownSystemMetric(metric)) {
        logger.warn({ nodeId, topic, metric }, "⚠️ Unknown system metric");
        return;
    }

    const payload = inferSystemValue(metric, raw);

    const message: SystemMessage<typeof metric> = {
        nodeId,
        topic,
        metric,
        value: payload,
        valueType: typeof payload,
    };

    await writeSystemPoint(nodeId, metric, message.value);

    logger.info(message, `🧩 [Node ${nodeId}] System ${metric} = ${payload}`);
}
