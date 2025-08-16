import { Response } from "express";
import { Router } from "express"
import { Task } from "../db";
import { userMiddleware } from "../middlewares/userMiddleware";
import { AuthRequest } from "../types";
const taskRouter = Router();

taskRouter.post("/addtasks", userMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {

    try {


        const taskTitle = req.body.taskTitle;
        const taskDescription = req.body.taskDescription;
        const taskStatus = req.body.taskStatus;

        if (!req.userId) {
            res.status(401).json({
                message: "Unauthorized access"
            });
            return
        }

        if (taskDescription.length > 234) {
            res.status(400).json({ message: "Task description cannot exceed 234 characters" });
            return;
        }

        const newTask = await Task.create({
            userId: req.userId,
            taskTitle,
            taskDescription,
            taskStatus
        })


        res.status(201).json({
            message: "Task added to the list",
            newTask
        });
        return
    } catch (error) {
        res.status(500).json({
            message: "Error creating task",
            error
        });
        return
    }


})
taskRouter.get("/viewtasks", userMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    // const userId = req.userId;


    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const responseTasks = await Task.find({
            userId: req.userId
        })

        if (responseTasks) {
            res.status(200).json(
                responseTasks || []
            )
        }
        console.log(responseTasks);
    } catch (error) {
        res.status(500).json({
            message: "Cannot find tasks",
            error
        })
    }


})

taskRouter.put("/updatetasks", userMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {

    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { taskTitle, taskDescription, contentId } = req.body;

        const updatedTask = await Task.updateOne({

            _id: contentId,
            userId: req.userId,
        }, {

            $set: {
                taskTitle,
                taskDescription,
            }
        })

        res.status(200).json({
            message: "Content updated successfully",
            updatedTask
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed updating task",
            error
        })
    }


})

taskRouter.delete("/deletetasks", userMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
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

        const taskToDelete = await Task.findOneAndDelete({
            _id: contentId,
            userId: req.userId,
        })

        if (!taskToDelete) {
            res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });


    } catch (error) {
        res.status(500).json({
            message: "Failed deleting task",
            error
        })
    }


});



// updateStatus of task 

taskRouter.put("/updatetaskStatus", userMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {

    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { taskStatus, contentId } = req.body;

        const updatedTask = await Task.updateOne({

            _id: contentId,
            userId: req.userId,
        }, {

            $set: {
                taskStatus
            }
        })

        res.status(200).json({
            message: "Task Status updated successfully",
            updatedTask
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed updating task",
            error
        })
    }


})

export default taskRouter;
