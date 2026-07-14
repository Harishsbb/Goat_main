const fs = require("fs");
const path = require("path");

class TagDataProvider {

    constructor() {
        this.cache = new Map();
    }

    getTagData(videoPath) {

        // Check cache first
        if (this.cache.has(videoPath)) {
            return Promise.resolve(
                this.cache.get(videoPath)
            );
        }
    //   const fileName = path.parse(videoPath).name;
        // console.log("videoPath:", videoPath);
        
        const jsonPath = videoPath.replace(".mp4", ".json")
        // console.log("JSON Path:", jsonPath);
         console.log("hello",jsonPath);
   

        return new Promise((resolve, reject) => {

            fs.readFile(
                jsonPath,
                "utf8",
                (error, data) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    try {
                        const jsonData = JSON.parse(data);

                        // Store in cache
                        this.cache.set(
                            videoPath,
                            jsonData
                        );

                        resolve(jsonData);

                    } catch (err) {
                        reject(err);
                    }
                }
            );

        });

   
}

    }


module.exports = TagDataProvider;