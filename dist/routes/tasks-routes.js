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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const userMiddleware_1 = require("../middlewares/userMiddleware");
const taskRouter = (0, express_1.Router)();
taskRouter.post("/addtasks", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskTitle = req.body.taskTitle;
        const taskDescription = req.body.taskDescription;
        const taskStatus = req.body.taskStatus;
        if (!req.userId) {
            res.status(401).json({
                message: "Unauthorized access"
            });
            return;
        }
        if (taskDescription.length > 234) {
            res.status(400).json({ message: "Task description cannot exceed 234 characters" });
            return;
        }
        const newTask = yield db_1.Task.create({
            userId: req.userId,
            taskTitle,
            taskDescription,
            taskStatus
        });
        res.status(201).json({
            message: "Task added to the list",
            newTask
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating task",
            error
        });
        return;
    }
}));
taskRouter.get("/viewtasks", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId = req.userId;
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const responseTasks = yield db_1.Task.find({
            userId: req.userId
        });
        if (responseTasks) {
            res.status(200).json(responseTasks || []);
        }
        console.log(responseTasks);
    }
    catch (error) {
        res.status(500).json({
            message: "Cannot find tasks",
            error
        });
    }
}));
taskRouter.put("/updatetasks", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { taskTitle, taskDescription, contentId } = req.body;
        const updatedTask = yield db_1.Task.updateOne({
            _id: contentId,
            userId: req.userId,
        }, {
            $set: {
                taskTitle,
                taskDescription,
            }
        });
        res.status(200).json({
            message: "Content updated successfully",
            updatedTask
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed updating task",
            error
        });
    }
}));
taskRouter.delete("/deletetasks", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { contentId } = req.body;
        if (!contentId) {
            res.status(400).json({ error: "Content ID is required." });
            return;
        }
        const taskToDelete = yield db_1.Task.findOneAndDelete({
            _id: contentId,
            userId: req.userId,
        });
        if (!taskToDelete) {
            res.status(404).json({
                message: "Task not found"
            });
        }
        res.status(200).json({
            message: "Task deleted successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed deleting task",
            error
        });
    }
}));
// updateStatus of task 
taskRouter.put("/updatetaskStatus", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { taskStatus, contentId } = req.body;
        const updatedTask = yield db_1.Task.updateOne({
            _id: contentId,
            userId: req.userId,
        }, {
            $set: {
                taskStatus
            }
        });
        res.status(200).json({
            message: "Task Status updated successfully",
            updatedTask
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed updating task",
            error
        });
    }
}));
exports.default = taskRouter;
