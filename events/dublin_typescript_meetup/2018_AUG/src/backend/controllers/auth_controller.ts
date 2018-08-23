import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Repository } from "typeorm";
import { User } from "../entities/user";

export function getAuthHandlers(userRepository: Repository<User>) {

    const loginHandler = (req: Request, res: Response) => {
        (async () => {

            // Read secret key from environment variables
            const secret = process.env.AUTH_SECRET;

            // Validate inputs
            const email = req.body.email;
            const password = req.body.password;

            if (typeof email !== "string" || typeof password !== "string") {
                res.status(400).send();
            } else {
                // Check if user with given email and password exists
                const user = await userRepository.findOne({
                    where: {
                        email: email,
                        password: password
                    }
                });
                if (!user) {
                    res.status(401).send();
                } else{
                    // If secret is undefined, there is an internal server error
                    if (!secret) {
                        res.status(500).send();
                    } else {
                        // Return JWT tocken
                        const token = jwt.sign({ id: user.id }, secret);
                        res.json({ token: token });
                    }
                }
            }

        })();
    };

    return {
        loginHandler: loginHandler
    };
    
}

export function getAuthController(userRepository: Repository<User>) {
    const authHandlers = getAuthHandlers(userRepository);
    const authController = Router();
    authController.post("/login", authHandlers.loginHandler); // public
    return authController;
}
