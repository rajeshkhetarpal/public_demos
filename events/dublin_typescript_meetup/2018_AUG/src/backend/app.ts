import express from "express";
import * as bodyParser from "body-parser";
import { getUserRepository } from "./repositories/user_repository";
import { getLinkRepository } from "./repositories/link_repository";
import { getVoteRepository } from "./repositories/vote_repository";
import { getLinksController } from "./controllers/links_controller";
import { getUsersController } from "./controllers/users_controller";
import { getAuthController } from "./controllers/auth_controller";
import { connecToDatabase } from "./db";

export async function getApp() {

    // Database
    await connecToDatabase();

    // App
    const app = express();

    // Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Repositories
    const userRepository = getUserRepository();
    const linkRepository = getLinkRepository();
    const voteRepository = getVoteRepository();

    // Controllers
    const authController = getAuthController(userRepository);
    const usersController = getUsersController(userRepository);
    const linksController = getLinksController(linkRepository, voteRepository);

    // Routes
    app.get("/", (req, res) => {
        res.send("Welcome to the API server!");
    });

    app.use("/api/v1/users", usersController);
    app.use("/api/v1/links", linksController);
    app.use("/api/v1/auth", authController);

    return app;
}
