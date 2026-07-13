const fs = require("fs");
const path = require("path");

class VideoProvider {

    getVideoStream(videoId) {

        const videoPath = path.join(
            __dirname,
            "..",
            "uploads",
            `${videoId}.mp4`
        );

        console.log("videoPath:", videoPath);

        if (!fs.existsSync(videoPath)) {
            const error = new Error("Video not found");
            error.statusCode = 404;
            throw error;
        }

        return fs.createReadStream(videoPath);
    }
}

module.exports = VideoProvider;