import dotenv from "dotenv";
dotenv.config();
import mongoose, { Schema, Document } from "mongoose";
const objId = mongoose.Types.ObjectId;
// const Schema = mongoose.Schema;

// console.log("cmd1");

type mongoUrlType = string | undefined;
export const mongoConnectionString: mongoUrlType = process.env.MONGO_URL;

// console.log("cmd2");
if (!mongoConnectionString) {
    throw new Error("MONGO_URL is not defined in environment variables")
}
mongoose.connect(mongoConnectionString)
    .then(() => {
        console.log("Connected to database");
    }).catch(error => console.error("MongoDB connection error:", error));

// console.log(mongoConnectionString);

export interface userInterface extends Document {
    email: string,
    userName: string,
    fullName: string,
    password: string
}

export interface taskInterface extends Document {
    userId: mongoose.Types.ObjectId,
    taskTitle: string,
    taskDescription: string,
    taskStatus: boolean,
    taskCreatedAt: Date
}

const userSchema = new Schema<userInterface>({
    email: {
        type: String,
        unique: true,
        required: true
    },
    userName: {
        type: String,
        unique: true,
        required: true
    },
    fullName: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    }
});

const taskSchema = new Schema<taskInterface>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,

    },
    taskTitle: {
        type: String,
        required: true
    },
    taskDescription: {
        type: String,
        required: true,
        maxlength: 234
    },
    taskStatus: {
        type: Boolean,
        default: false,
    },
    taskCreatedAt: {
        type: Date,
        default: Date.now
    }
})


export const User = mongoose.model<userInterface>("User", userSchema);
export const Task = mongoose.model<taskInterface>("Task", taskSchema);