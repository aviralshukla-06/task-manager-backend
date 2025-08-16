import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod"

import { User } from "../db"

const userRouter = Router();

type jwtSecretType = string | undefined;
const jwtSecret: jwtSecretType = process.env.JWT_SECRET;

userRouter.post("/register", async (req: Request, res: Response): Promise<void> => {
    const reqBody = z.object({
        email: z.string(),
        userName: z.string().min(3).max(20),
        fullName: z.string(),
        password: z.string(),
    });

    const parsedBody = reqBody.safeParse(req.body);

    if (!parsedBody.success) {
        res.status(403).json({
            message: parsedBody.error.issues
        });
        return
    }

    const existingUser = await User.findOne({
        email: req.body.email
    })


    const { email, userName, fullName, password, } = parsedBody.data;
    const hashedPassword = await bcrypt.hash(password, 5);

    try {
        const newUser = await User.create({
            email,
            userName,
            fullName,
            password: hashedPassword
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred while creating the user"
        })

        return
    }

    res.json({
        message: "You have successfully signed-up"
    });

})

userRouter.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const signingUser = await User.findOne({
        email: req.body.email
    })

    if (!signingUser) {
        res.status(403).json({
            message: "User does Not exist."
        });
        return
    }

    const passwordMatch = await bcrypt.compare(password, signingUser.password)


    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    if (passwordMatch) {
        const token = jwt.sign({
            id: signingUser._id
        }, jwtSecret);
        res.status(200).json({
            message: "You have successfully logged-in",
            token: token
        });
    } else {
        res.status(403).json({
            message: "Incorrect details"
        });
        return
    }

})

export default userRouter;