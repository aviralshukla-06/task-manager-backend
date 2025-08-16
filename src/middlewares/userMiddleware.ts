import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export const userMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;
    // const token = authHeader?.split(" ")[1]; // Extract Bearer token

    if (!authHeader) {
        res.status(401).json({ message: "Token missing" });
        return;
    }

    try {
        const decoded = jwt.verify(authHeader, secret) as JwtPayload;
        const userId = (decoded.id || decoded._id) as string;
        if (userId) {
            req.userId = userId
            next();
        } else {
            res.status(401).json({ message: "Invalid token payload" });
        }
    } catch {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
