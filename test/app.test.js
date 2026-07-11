const request = require("supertest");
const app = require("../app");

describe("Tag API", () => {

    test(
        "should return status 200",
        async () => {

            const response = await request(app)
                .get("/api/tags/singletag.mp4");

            expect(response.statusCode)
                .toBe(200);

        },
        30000
    );

});