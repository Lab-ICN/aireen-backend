import { logger } from "../../libs/logger";
import { parsePayload } from "../utils/parsePayload";
import type { SystemMessage } from "../types/system";

export async function handleSystemMessage(
    nodeId: string,
    topic: string,
    raw: string
) {
    const metric = topic.split("/").pop() ?? "unknown";
    const payload = parsePayload(raw);

    const message: SystemMessage = {
        nodeId,
        topic,
        metric,
        value: payload,
        valueType: typeof payload,
    };

    logger.info(message, `🧩 [Node ${nodeId}] System ${metric} = ${payload}`);
}
