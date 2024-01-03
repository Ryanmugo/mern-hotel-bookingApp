import express from "express";
import { searchBar, viewDetails } from "../controllers/searchControllers";
import { param } from "express-validator";

const router = express.Router();

//Search bar api
router.get("/search", searchBar);

//vIEW dETAILS api
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  viewDetails
);

export default router;
