// const fs = require("fs");
// const path = require("path");

// class TagDataProvider {

//     constructor() {
//         this.cache = new Map();
//     }

//     getTagData(videoPath) {

//         // Check cache first
//         if (this.cache.has(videoPath)) {
//             return Promise.resolve(
//                 this.cache.get(videoPath)
//             );
//         }
//     //   const fileName = path.parse(videoPath).name;
//         // console.log("videoPath:", videoPath);
        
//         const jsonPath = videoPath.replace(".mp4", ".json")
//         // console.log("JSON Path:", jsonPath);
//          console.log("hello",jsonPath);
   

//         return new Promise((resolve, reject) => {

//             fs.readFile(
//                 jsonPath,
//                 "utf8",
//                 (error, data) => {

//                     if (error) {
//                         reject(error);
//                         return;
//                     }

//                     try {
//                         const jsonData = JSON.parse(data);

//                         // Store in cache
//                         this.cache.set(
//                             videoPath,
//                             jsonData
//                         );

//                         resolve(jsonData);

//                     } catch (err) {
//                         reject(err);
//                     }
//                 }
//             );

//         });

   
// }

//     }


// module.exports = TagDataProvider;

// const { execFile } = require("child_process");
// const fs = require("fs");
// const path = require("path");
// const util = require("util");
// const execFileAsync = util.promisify(execFile);

// class TagDataProvider {

//     constructor() {
//         this.cache = new Map();
//     }

//     // getTagData(videoPath) {

//     //     // Check cache first
//     //     if (this.cache.has(videoPath)) {
//     //         return Promise.resolve(
//     //             this.cache.get(videoPath)
//     //         );
//     //     }
//     // //   const fileName = path.parse(videoPath).name;
//     //     // console.log("videoPath:", videoPath);
        
//     //     const jsonPath = videoPath.replace(".mp4", ".json")
//     //     // console.log("JSON Path:", jsonPath);
//     //      console.log("hello",jsonPath);
   

//     //     return new Promise((resolve, reject) => {

//     //         fs.readFile(
//     //             jsonPath,
//     //             "utf8",
//     //             (error, data) => {

//     //                 if (error) {
//     //                     reject(error);
//     //                     return;
//     //                 }

//     //                 try {
//     //                     const jsonData = JSON.parse(data);

//     //                     // Store in cache
//     //                     this.cache.set(
//     //                         videoPath,
//     //                         jsonData
//     //                     );

//     //                     resolve(jsonData);

//     //                 } catch (err) {
//     //                     reject(err);
//     //                 }
//     //             }
//     //         );

//     //     });



// async function getTagData(videoPath) {

//     if (!fs.existsSync(videoPath)) {
//         const error = new Error("Video file not found");
//         error.statusCode = 404;
//         throw error;
//     }

//     const jsonPath = videoPath.replace(".mp4", ".json");

//     if (!fs.existsSync(jsonPath)) {
//         const scriptPath = path.join(__dirname, "..", "video_detect.py");

//         try {
//             await execFileAsync("python", [scriptPath, videoPath], { timeout: 60000 });
//             console.log("JSON file created successfully.");
//         } catch (err) {
//             console.error(`Error executing Python script: ${err}`);
//             throw err;  // bubble up so controller can send 500
//         }
//     } else {
//         console.log("JSON file already exists. Reading from JSON.");
//     }

//     // NOW it's safe to read — either it already existed, or we just waited for it
//     const data = fs.readFileSync(jsonPath, "utf8");
//     return JSON.parse(data);
// }



const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");
const util = require("util");
const execFileAsync = util.promisify(execFile);

class TagDataProvider {

    constructor() {
        this.cache = new Map();
    }

    async getTagData(videoPath) {

        // 1. Check in-memory cache first
        if (this.cache.has(videoPath)) {
            return this.cache.get(videoPath);
        }

        // 2. Confirm video actually exists
        if (!fs.existsSync(videoPath)) {
            const error = new Error("Video file not found");
            error.statusCode = 404;
            throw error;
        }

        const jsonPath = videoPath.replace(".mp4", ".json");

        // 3. Generate JSON if it doesn't exist yet
        if (!fs.existsSync(jsonPath)) {
            const scriptPath = path.join(__dirname, "..", "video_detect.py");
            console.log("scriptpath",scriptPath)

            try {
                await execFileAsync(
                    "python",
                    [scriptPath, videoPath],
                    { timeout: 60000 }
                );
                console.log("JSON file created successfully.");
            } catch (err) {
                console.error(`Error executing Python script: ${err}`);
                throw err;
            }
        } else {
            console.log("JSON file already exists. Reading from JSON.");
        }

        // 4. Read JSON (either just-created or already existed)
        const data = fs.readFileSync(jsonPath, "utf8");
        const jsonData = JSON.parse(data);

        // 5. Cache it for next time (in-memory, same server session)
        this.cache.set(videoPath, jsonData);

        return jsonData;
    }
}

module.exports = TagDataProvider;