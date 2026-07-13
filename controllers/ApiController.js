const { error } = require("console");
const fs = require('fs')
const path = require("path");
// List of allowed video file extensions
const allowedExtensions = [".mp4",".avi",".mov",".mkv","webm",".flv","wmv","ts",".m3u8",".3gp"];

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

            const ext = path.extname(videoPath).toLowerCase();

            if(!allowedExtensions.includes(ext)){
                return res.status(400).json ({error:"Unsupported file type"});
            }

            if(!fs.existsSync(videoPath)){
                return res.status(404).json({error:"video file not found"});
            }

            const data =
                await this.tagProvider.getTagData(videoPath);

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