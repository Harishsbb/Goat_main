const { exec } = require("child_process");

class TagDataProvider {

    constructor() {
        this.cache = new Map();
    }

    getTagData(videoPath) {

        // Check cache first
        if (this.cache.has(videoPath)) {
            return Promise.resolve(this.cache.get(videoPath));
        }

        return new Promise((resolve, reject) => {

            exec(
                `python video_detect.py "${videoPath}"`,
                (error, stdout, stderr) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    try {
                        const data = JSON.parse(stdout);
                        // Store in cache
                        this.cache.set(videoPath, data);
                        resolve(data);
                    }
                    catch (err) {
                        reject(err);
                    }
                }
            );

        });

    }
}

module.exports = TagDataProvider;