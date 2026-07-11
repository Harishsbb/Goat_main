const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();

app.use(express.json());



// MODEL / PROVIDER
class TagDataProvider {

    getTagData(videoPath) {

        return new Promise((resolve, reject) => {

            exec(
    `python video_detect.py "${videoPath}"`,
    (error, stdout, stderr) => {

        console.log("STDOUT =", stdout);
        console.log("STDERR =", stderr);

        if (error) {
            reject(error);
            return;
        }

        try {
            const data = JSON.parse(stdout);
            resolve(data);
        } catch (err) {
            reject(err);
        }
    }
);

        });

    }
}

// CONTROLLER
class ApiController {

    constructor(tagProvider) {
        this.tagProvider = tagProvider;
    }

    getTags = async (req, res) => {

        try {

            const videoPath = path.join(
                __dirname,
                "uploads",
                req.params.id
            );

            console.log("Video Path:", videoPath);

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



// DEPENDENCY INJECTION

const tagProvider = new TagDataProvider();
const controller = new ApiController(tagProvider)

// ROUTE

app.get(
    "/api/tags/:id",
    controller.getTags
);


// SERVER

app.listen(3000, () => {
    console.log("Server running on port 3000");
});