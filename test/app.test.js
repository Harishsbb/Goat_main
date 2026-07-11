const request = require("supertest");
const app = require("../app");
const { acceptsLanguages } = require("express/lib/request");
const { renew } = require("supertest/lib/cookies");

describe("Tag API", () => {

    test(
        "should return status 200 for existing file",
        async () => {

            const response = await request(app)
                .get("/api/tags/multiple_tag.mp4");

            expect(response.statusCode)
                .toBe(200);

        },
        30000
    );

    test(
        "should return status 404 not existing file",
        async () => {

            const response = await request(app)
                .get("/api/tags/multipletag.mp4");

            expect(response.statusCode)
                .toBe(404);

        },
        30000
    );

    test(
        "should not return status 200 for detecting the fails -success case",
        async () => {
            const response = await request(app)
                .get("/api/tags/notag.mp4");

            expect(response.statusCode)
                .toBe(200);
        },
        30000
    );

    test(
        "should return 400 status for wrong extension",

        async () => {
            const response = await request(app)
                .get("/api/tags/multipletag,mp4");

            expect(response.statusCode)
                .toBe(400);
        },
        40000
    );

    test("should return 400 or safe error for path traversal attempt", async () => {
    const response = await request(app)
        .get("/api/tags/..%2F..%2Fapp.js"); // encoded ../../app.js

    // Right now your code doesn't explicitly guard against this —
    // this test will reveal whether it currently leaks or fails safely
    expect(response.statusCode).not.toBe(200);
});
    test("should return response body with expected tag data shape", async () => {
    const response = await request(app)
        .get("/api/tags/multiple_tag.mp4");

    expect(typeof response.body).toBe("object");
    expect(Object.keys(response.body).length).toBeGreaterThan(0);
}, 30000)
});