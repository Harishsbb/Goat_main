const { exec } = require("child_process");

class TagDataProvider {

    getTagData(videoPath) {

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