"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = require("../db");
const userRouter = (0, express_1.Router)();
const jwtSecret = process.env.JWT_SECRET;
userRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = zod_1.z.object({
        email: zod_1.z.string(),
        userName: zod_1.z.string().min(3).max(20),
        fullName: zod_1.z.string(),
        password: zod_1.z.string(),
    });
    const parsedBody = reqBody.safeParse(req.body);
    if (!parsedBody.success) {
        res.status(403).json({
            message: parsedBody.error.issues
        });
        return;
    }
    const existingUser = yield db_1.User.findOne({
        email: req.body.email
    });
    const { email, userName, fullName, password, } = parsedBody.data;
    const hashedPassword = yield bcrypt_1.default.hash(password, 5);
    try {
        const newUser = yield db_1.User.create({
            email,
            userName,
            fullName,
            password: hashedPassword
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred while creating the user"
        });
        return;
    }
    res.json({
        message: "You have successfully signed-up"
    });
}));
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const signingUser = yield db_1.User.findOne({
        email: req.body.email
    });
    if (!signingUser) {
        res.status(403).json({
            message: "User does Not exist."
        });
        return;
    }
    const passwordMatch = yield bcrypt_1.default.compare(password, signingUser.password);
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    if (passwordMatch) {
        const token = jsonwebtoken_1.default.sign({
            id: signingUser._id
        }, jwtSecret);
        res.status(200).json({
            message: "You have successfully logged-in",
            token: token
        });
    }
    else {
        res.status(403).json({
            message: "Incorrect details"
        });
        return;
    }
}));
exports.default = userRouter;
