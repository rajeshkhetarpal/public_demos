import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth_middleware";
import { Repository } from "typeorm";
import { User } from "../entities/user";

export function getUsersHandlers(
    userRepository: Repository<User>
) {

    // Creates a new user
    const createUserHander = (req: Request, res: Response) => {
        (async () => {
            try {

                const email = req.body.email;
                const password = req.body.password;

                // Validate inputs
                if (!email && !password) {
                    res.status(400).send();
                }

                // 400 if user already exists
                const existingUser = await userRepository.findOne({ email: email });

                if (existingUser) {
                    res.status(400).send("User already exists");
                }

                // Save user
                const user = await userRepository.save({
                    email,
                    password
                });

                res.json(user).send();

            } catch (err) {
                console.log(err);
                res.status(500).send();
            }
        })();
    };

    return {
        createUserHander: createUserHander
    };
    
}

export function getUsersController(
    userRepository: Repository<User>
) {
    const handlers = getUsersHandlers(userRepository);
    const usersController = Router();
    usersController.post("/", handlers.createUserHander); // public
    return usersController;
}
