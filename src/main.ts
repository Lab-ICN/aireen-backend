import { config } from "./config";
import { logger } from "./libs/logger";

async function bootstrap() {
    const mode = process.env.APP_MODE || "app";
    logger.info(`🚀 Starting Aireen backend in mode: ${mode}`);

    try {
        if (mode === "app") {
            const { createApp } = await import("./app/app");
            const app = await createApp();

            app.listen(config.port, () => {
                logger.info(`✅ App running on port ${config.port}`);
            });
        }

        else if (mode === "worker") {
            const { startWorker } = await import("./worker/worker");
            await startWorker();
        }

        else {
            logger.error({ mode }, "❌ Unknown APP_MODE");
            process.exit(1);
        }
    } catch (err) {
        logger.error({ err }, "💥 Fatal error during bootstrap");
        process.exit(1);
    }

    // Graceful shutdown
    process.on("SIGINT", async () => {
        logger.warn("🛑 Shutting down gracefully (SIGINT)...");
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        logger.warn("🛑 Shutting down gracefully (SIGTERM)...");
        process.exit(0);
    });
}

bootstrap();
