"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
console.log("reached here");
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const tasks_routes_1 = __importDefault(require("./routes/tasks-routes"));
// import taskRouter from "./routes/tasks-routes"
console.log("here too");
app.use("/api/users", user_routes_1.default);
console.log("????");
app.use("/api/tasks", tasks_routes_1.default);
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// import "./db"
// console.log("here");
// const mongoUri = process.env.MONGO_URL
// console.log(mongoUri);
console.log("after uri");
const jwtsec = process.env.JWT_SECRET;
console.log(jwtsec);
console.log("logged secret");
console.log("Hello Infinity");
app.listen(3000);
