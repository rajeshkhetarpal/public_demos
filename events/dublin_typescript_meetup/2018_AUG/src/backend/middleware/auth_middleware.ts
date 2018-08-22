import express from "express";
import jwt from "jsonwebtoken";
import { getUserRepository } from "../repositories/user_repository";

export function authMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    try {
        // Read token from request headers
        const token = req.headers["authorization"];
        // If no token not a string, it is an invalid request
        if (token === undefined || Array.isArray(token)) {
            res.status(400).send();
        } else {
            // Read secret from environment variables
            const secret = process.env.AUTH_SECRET;
            // If secret is undefined, there is an internal server error
            if (!secret) {
                res.status(500).send();
            } else {
                let decoded: any;
                try {
                    // Decode token and get user id
                    decoded = jwt.verify(token, secret) as any;
                } catch(e) {
                    // If cannot decode token, the user is unauthorized
                    res.status(401).send();
                }
                // Attach current user to request objs
                // Note that we don't need to do additional db queries
                (req as any).userId = decoded.id;
                // Invoke next handler
                next();
            }
        }
    } catch (e) {
        res.status(500).send();
    }
}
