import { expect } from "chai";
import request from "supertest";
import jwt from "jsonwebtoken";
import { getApp } from "../src/backend/app";

describe("Links Controller", () => {

    it ("Should be able to create a link", (done) => {

        getApp().then((app) => {

            const secret = process.env.AUTH_SECRET;
            const FAKE_TOKEN = jwt.sign({ id: 1 }, secret);
    
            const link = {
                title: "test_title_" + new Date().getTime(),
                url: "test_url_" + new Date().getTime(),
            };
    
            request(app).post("/api/v1/links")
                        .send(link)
                        .set("Content-Type", "application/json")
                        .set("Accept", "application/json")
                        .set("Authorization", FAKE_TOKEN)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) throw err;
                            expect(res.body.title).eql(link.title);
                            expect(res.body.url).eql(link.url);
                            done();
                        });

        });

    });

});
