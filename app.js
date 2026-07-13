const express = require("express");
const TagDataProvider = require("./providers/TagDataProvider");
const VideoProvider = require("./providers/VideoProvider");
const ApiController = require("./controllers/ApiController");
const createApiRouter = require("./routes/apiRoutes");

const app = express();
app.use(express.json());

const tagProvider = new TagDataProvider();
const videoProvider = new VideoProvider();
const controller = new ApiController(videoProvider, tagProvider);

app.use("/api", createApiRouter(controller));

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;