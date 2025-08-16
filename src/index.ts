import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import express from "express"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());

console.log("reached here");
import userRouter from "./routes/user-routes"
import taskRouter from "./routes/tasks-routes";
// import taskRouter from "./routes/tasks-routes"
console.log("here too");


app.use("/api/users", userRouter)
console.log("????");
app.use("/api/tasks", taskRouter)

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
});

// import "./db"
// console.log("here");


// const mongoUri = process.env.MONGO_URL
// console.log(mongoUri);
console.log("after uri");
const jwtsec = process.env.JWT_SECRET
console.log(jwtsec);
console.log("logged secret");



console.log("Hello Infinity");
app.listen(3000)
