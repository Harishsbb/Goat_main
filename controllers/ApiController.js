const path = require("path");

class ApiController {

    constructor(tagProvider) {
        this.tagProvider = tagProvider;
    }

    getTags = async (req, res) => {

        try {

            const videoPath = path.join(
                __dirname,
                "..",
                "uploads",
                req.params.id
            );

            const data =
                await this.tagProvider.getTagData(videoPath);

            res.json(data);

        }
        catch (error) {

            res.status(500).json({
                error: error.message
            });

        }
    };
}

module.exports = ApiController;