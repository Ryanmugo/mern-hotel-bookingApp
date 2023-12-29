import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";

mongoose.connect(process.env.MONGO_URI as string);

const app = express();

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", userRoutes);

app.listen(5000, () => {
  console.log("Server is running on localhost:5000");
});
