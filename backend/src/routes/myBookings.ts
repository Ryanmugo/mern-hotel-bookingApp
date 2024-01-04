import express from "express";
import { verifyToken } from "../middlewares/auth";
import { bookings } from "../controllers/bookings";

const router = express.Router();

//My bookings page functionality
router.get("/", verifyToken, bookings);

export default router;
