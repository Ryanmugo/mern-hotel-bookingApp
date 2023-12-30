import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import cookieParser from "cookie-parser";
import path from "path";

mongoose.connect(process.env.MONGO_URI as string);

const app = express();

const PORT = process.env.PORT || 5000;

//middlewares
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/users", userRoutes);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log("Server is running on localhost:5000");
});
