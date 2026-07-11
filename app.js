const express = require("express");

const TagDataProvider =
    require("./providers/TagDataProvider");

const ApiController =
    require("./controllers/ApiController");

const createApiRouter =
    require("./routes/apiRoutes");

const app = express();

app.use(express.json());


// Dependency Injection
const tagProvider = new TagDataProvider();

const controller =
    new ApiController(tagProvider);


app.use(
    "/api",
    createApiRouter(controller)
);

if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

module.exports = app;