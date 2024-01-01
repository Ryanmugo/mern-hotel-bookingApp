import express from "express";
import { searchBar } from "../controllers/searchControllers";

const router = express.Router();

//Search bar api
router.get("/search", searchBar);

export default router;
