const express = require("express");

function createApiRouter(apiController) {

    const router = express.Router();

    router.get(
        "/videos/:id",
        apiController.getVideoByID
    );

    router.get(
        "/tags/:id",
        apiController.getAprilTagDataByID
    );

    return router;
}

module.exports = createApiRouter;