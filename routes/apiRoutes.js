const express = require("express");

function createApiRouter(controller) {

    const router = express.Router();

    router.get(
        "/tags/:id",
        controller.getTags
    );

    return router;
}

module.exports = createApiRouter;