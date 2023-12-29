import express from "express";
import { registerUsers } from "../controllers/registerControllers";

const router = express.Router();

router.post("/register", registerUsers);

export default router;
