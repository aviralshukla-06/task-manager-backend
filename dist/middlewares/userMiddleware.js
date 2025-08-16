"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
const userMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // const token = authHeader?.split(" ")[1]; // Extract Bearer token
    if (!authHeader) {
        res.status(401).json({ message: "Token missing" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(authHeader, secret);
        const userId = (decoded.id || decoded._id);
        if (userId) {
            req.userId = userId;
            next();
        }
        else {
            res.status(401).json({ message: "Invalid token payload" });
        }
    }
    catch (_a) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.userMiddleware = userMiddleware;
