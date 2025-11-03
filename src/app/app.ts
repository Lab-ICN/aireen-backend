import express from "express";

export async function createApp() {
    const app = express();
    app.use(express.json());

    app.get("/", (req, res) => {
        res.json({ message: "Hello from Bun backend!" });
    });

    return app;
}
