import express from "express";
import {
  myBookings,
  searchBar,
  stripePayment,
  viewDetails,
} from "../controllers/searchControllers";
import { param } from "express-validator";
import { verifyToken } from "../middlewares/auth";

const router = express.Router();

//Search bar api
router.get("/search", searchBar);

//vIEW dETAILS api
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  viewDetails
);

//stripe payments!!
router.post("/:hotelId/bookings/payment-intent", verifyToken, stripePayment);

router.post("/:hotelId/bookings", verifyToken, myBookings);

export default router;
