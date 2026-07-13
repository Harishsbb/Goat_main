const path = require("path");

class ApiController {

    constructor(videoProvider, tagProvider) {
        this.videoProvider = videoProvider;
        this.tagProvider = tagProvider;
    }

    getVideoByID = (req, res) => {

        try {
            console.log("getvideoByID called");
            const { id } = req.params;

            console.log("Requested Video ID:", id);

            const videoStream =
                this.videoProvider.getVideoStream(id);

            res.setHeader(
                "Content-Type",
                "video/mp4"
            );

            videoStream.pipe(res);

        }
        catch (error) {

            res.status(
                error.statusCode || 500
            ).json({
                error: error.message
            });
        }
    };

    getAprilTagDataByID = async (req, res) => {

        try {

            const videoPath = path.join(
                __dirname,
                "..",
                "uploads",
                `${req.params.id}.mp4`
            );

            const data =
                await this.tagProvider.getTagData(
                    videoPath
                );

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