import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth_middleware";
import { Repository } from "typeorm";
import { Link } from "../entities/link";
import { Vote } from "../entities/vote";

export function getLinksHandlers(
    linkRepository: Repository<Link>,
    voteRepository: Repository<Vote>
) {

    // Returns all links
    const getLinksHandler =  (req: Request, res: Response) => {
        (async () => {
            try {
                const links = await linkRepository.find({
                    relations: ["user"]
                });
                res.json(links);
            } catch (err) {
                console.log(err);
                res.status(500).send();
            }
        })();
    };

    // Creates a link
    const createLinkHandler = (req: Request, res: Response) => {
        (async () => {
            try {

                const userId = (req as any).userId;

                const link = {
                    title: req.body.title,
                    url: req.body.url,
                    user: {
                        id: userId
                    }
                };

                // Check if link already exists
                const existingLink = await linkRepository.findOne({
                    where: {
                        url: link.url
                    }
                });

                 if (existingLink) {
                     res.status(400).send("Link already exists!");
                 } else {
                    const newLink = await linkRepository.save(link);
                    res.json(newLink);
                 }


            } catch (err) {
                console.log(err);
                res.status(500).send();
            }
        })();
    };

    // Deletes a link
    const deleteLinkHandler = (req: Request, res: Response) => {
        (async () => {
            try {

                const userId = (req as any).userId;
                const linkId = req.params.id;

                // Try to find link by id
                const link = await linkRepository.findOne({
                    where: {
                        id: linkId
                    },
                    relations: ["user"]
                });

                // not found
                if (!link) {
                    res.status(404).send("Link not found!");
                } else {
                    // Check if user is not the owner
                    if (link.user.id != userId) {
                        res.status(403).send("You are not the owrner of the Link!");
                    } else {
                        // Find votes for link
                        const votes = await voteRepository.find({
                            where: {
                                link: {
                                    id: linkId
                                }
                            }
                        });
                        // Delete votes for link
                        for (const vote of votes) {
                            await voteRepository.deleteById(vote.id);
                        }
                        // Delete link
                        await linkRepository.deleteById(linkId);
                        res.json({ status: "success" }).send();
                    }
                }
            } catch (err) {
                console.log(err);
                res.status(500).send();
            }
        })();
    };
    
    // Upvotes link
    const upVoteHandler = (req: Request, res: Response) => {
        (async () => {
            try {

                const userId = (req as any).userId;
                const linkId = req.params.id;

                // Check if user has already voted this link
                const existingVote = await voteRepository.findOne({
                    user: { id: userId },
                    link: { id: linkId }
                });

                if (existingVote) {
                    // Voting two times is not alowed
                    res.status(403).send("Cannot vote two times!");
                } else {
                    // Save vote of it is the first time
                    const upvoted = await voteRepository.save({
                        user: { id: userId },
                        link: { id: linkId },
                        isUpvote: true
                    });
                    res.json(upvoted);
                }

            } catch (err) {
                console.log(err);
                res.status(500).send();
            }
        })();
    };
    
    // Downvotes link
    const downVoteHandler = (req: Request, res: Response) => {
        (async () => {
            try {

                const userId = (req as any).userId;
                const linkId = req.params.id;

                // Check if user has already voted this link
                const existingVote = await voteRepository.findOne({
                    where: {
                        user: { id: userId },
                        link: { id: linkId }
                    }
                });

                if (existingVote) {
                    // Voting two times is not alowed
                    res.status(403).send("Cannot vote two times!");
                } else {
                    // Save vote of it is the first time
                    const upvoted = await voteRepository.save({
                        user: { id: userId },
                        link: { id: linkId },
                        isUpvote: false
                    });
                    res.json(upvoted);
                }

            } catch (err) {
                console.log(err);
                res.status(500).send();
            }
        })();
    };

    // Returns all votes for links
    // NOTE: this one was not required by the CA but I added
    // it because it helped me to debug
    const getLinkVotesHandler =  (req: Request, res: Response) => {
        (async () => {
            try {
                const links = await voteRepository.find({
                    where: {
                        link: { id: req.params.id }
                    }
                });
                res.json(links);
            } catch (err) {
                console.log(err);
                res.status(500).send();
            }
        })();
    };

    return {
        getLinksHandler: getLinksHandler,
        createLinkHandler: createLinkHandler,
        deleteLinkHandler: deleteLinkHandler,
        upVoteHandler: upVoteHandler,
        downVoteHandler: downVoteHandler,
        getLinkVotesHandler: getLinkVotesHandler
    };
}

export function getLinksController(
    linkRepository: Repository<Link>,
    voteRepository: Repository<Vote>
) {
    
    const handlers = getLinksHandlers(linkRepository, voteRepository);
    const linksController = Router();

    // public
    linksController.get("/", handlers.getLinksHandler);
    linksController.get("/:id/votes", handlers.getLinkVotesHandler);

    // private
    linksController.post("/", authMiddleware, handlers.createLinkHandler);
    linksController.delete("/:id", authMiddleware, handlers.deleteLinkHandler);
    linksController.post("/:id/upvote", authMiddleware, handlers.upVoteHandler);
    linksController.post("/:id/downvote", authMiddleware, handlers.downVoteHandler);

    return linksController;
}
