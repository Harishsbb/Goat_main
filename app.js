const express = require("express");
require("dotenv").config();
// const TagDataProvider = require("./providers/TagDataProvider");
const { connectDB, MongoTagDataProvider } = require("./providers/MongoTagDataProvider");
const VideoProvider = require("./providers/VideoProvider");
const ApiController = require("./controllers/ApiController");
const createApiRouter = require("./routes/apiRoutes");
const mongoose = require("mongoose");
const cors = require("cors");

let app;
let controller;

async function initializeApp() {
    const conn = await connectDB();
    app = express();
    app.use(express.json());
    app.use(cors());

    // const tag = connectDB();
    // const tagProvider = new TagDataProvider(); // Old file-based provider
    const tagProvider = new MongoTagDataProvider(conn);
    const videoProvider = new VideoProvider();
    controller = new ApiController(videoProvider, tagProvider);

    app.use("/api", createApiRouter(controller));

    const PORT = process.env.PORT || 3000;

    if (require.main === module) {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }

    return app;
}

if (require.main === module) {
    initializeApp().catch((err) => {
        console.error("Failed to initialize app:", err);
        process.exit(1);
    });
}

module.exports = initializeApp;