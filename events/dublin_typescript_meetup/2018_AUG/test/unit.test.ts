import { expect } from "chai";
import { getLinksHandlers } from "../src/backend/controllers/links_controller";

describe("Links Controller Handlers", () => {

    it ("Should be able to create a link", (done) => {

        // Mock all dependencies so we can test in complete isolation

        const voteRepositoryMock: any = {};

        const mockReq: any = {
            userId: 1,
            body: {
                title: "test_title",
                url: "test_url"
            }
        };

        const expectedLink = {
            title: mockReq.body.title,
            url: mockReq.body.url,
            user: {
                id: mockReq.userId
            }
        };

        const linkRepositoryMock: any = {
            findOne: (options) =>Promise.resolve(null),
            save: (link) => Promise.resolve(expectedLink)
        };

        const mockRes: any = {
            json: (link) => {
                expect(link).eql(expectedLink);
                done();
            },
            status: (code) => {
                return {
                    send: (text) => {
                        done();
                    }
                };
            }
        };

        // Invoke method using mock dependencies

        const { createLinkHandler } = getLinksHandlers(linkRepositoryMock, voteRepositoryMock);
        createLinkHandler(mockReq, mockRes);

    });

});
