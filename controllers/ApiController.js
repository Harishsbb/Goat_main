const { error } = require("console");
const fs = require('fs')
const path = require("path");
// List of allowed video file extensions
const allowedExtensions = [".mp4",".avi",".mov",".mkv","webm",".flv","wmv","ts",".m3u8",".3gp"];

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

            const ext = path.extname(videoPath).toLowerCase();

            if(!allowedExtensions.includes(ext)){
                return res.status(400).json ({error:"Unsupported file type"});
            }

            if(!fs.existsSync(videoPath)){
                return res.status(404).json({error:"video file not found"});
            }

            const data =
                await this.tagProvider.getTagData(
                    req.params.id
                );

            res.json(data);

        }
        catch (error) {
         console.error(`[Error fetching tags for ID ${req.params.id}]:`, error);
            res.status(500).json({
                error: "Something went wrong on our end. Please try again later."
            });
        }
    };
}

module.exports = ApiController;