let tagData = {};
// new variable  create for path_history
let pathHistory = {};

let dotHistory = {};

const video = document.getElementById("video");
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");
console.log("test")
video.addEventListener("ended", () => {
    pathHistory = {};
    dotHistory = {};
});

video.addEventListener("seeked", () => {
    if (video.currentTime < 0.5) {
        pathHistory = {};
        dotHistory = {};
    }
});
fetch("http://localhost:3000/api/tags/mathesh")    
.then((response) =>{
    console.log("hello",response)
    return response.json()
    
}
)
    .then(data => {
        tagData = data;

        document.getElementById("jsonData").textContent =
            JSON.stringify(data, null, 2);

        console.log("Tag data loaded");
    })
    .catch(error => {
        console.error(error);
    });
video.addEventListener("loadedmetadata", () => {

    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;

    // console.log(
    //     "Original video size:",
    //     video.videoWidth,
    //     video.videoHeight
    // );
});

video.addEventListener("timeupdate", () => {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (const tagId in tagData) {

        const times =
            Object.keys(tagData[tagId]);

        let nearestTime = null;
        let minDiff = Infinity;

        for (const time of times) {

            const diff =
                Math.abs(
                    parseFloat(time) -
                    video.currentTime
                );

            if (diff < minDiff) {
                minDiff = diff;
                nearestTime = time;
            }
        }

        if (
            nearestTime !== null &&
            minDiff < 1
        ) {

            const [x, y] =
                tagData[tagId][nearestTime];

            const drawX =
                x *
                canvas.width /
                video.videoWidth;

            const drawY =
                y *
                canvas.height /
                video.videoHeight;

                //draw a line using coordinate_data 
                if (!pathHistory[tagId]) {
                pathHistory[tagId] = [];
            }

            const history = pathHistory[tagId];

            if (!dotHistory[tagId]) {
            dotHistory[tagId] = [];
        }

            if (
                history.length === 0 ||
                history[history.length - 1].x !== drawX ||
                history[history.length - 1].y !== drawY
            ) {
                history.push({
                    x: drawX,
                    y: drawY
                });
            }

            // dot draw after 2 seconds
            if (
                dotHistory[tagId].length === 0 ||
                video.currentTime -
                dotHistory[tagId][dotHistory[tagId].length - 1].time >= 2
            ) {
                dotHistory[tagId].push({
                    x: drawX,
                    y: drawY,
                    time: video.currentTime
                });
            }
            
            ctx.beginPath();

            for (let i = 0; i < pathHistory[tagId].length; i++) {

                const point = pathHistory[tagId][i];

                    if (i === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                }

                ctx.strokeStyle = "blue";
                ctx.lineWidth = 5;
                ctx.stroke();

                for (const dot of dotHistory[tagId]) {

                    ctx.beginPath();

                    ctx.arc(
                        dot.x,
                        dot.y,
                        3,
                        0,
                        Math.PI * 2
                    );

                    ctx.fillStyle = "red";
                    ctx.fill();
                }

                // Draw current box
                ctx.strokeStyle = "green";
                ctx.lineWidth = 4;

            ctx.strokeRect(
                drawX - 20,
                drawY - 20,
                40,
                40
            );
            
            ctx.fillStyle = "red";
            ctx.font = "20px Arial";

            ctx.fillText(
                `Tag ${tagId}`,
                drawX - 20,
                drawY - 30
            );
        }
    }
});