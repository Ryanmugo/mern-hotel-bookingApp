import express from "express";
import { hotels } from "../controllers/hotelContollers";
import multer from "multer";
import { verifyToken } from "../middlewares/auth";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //This means 5MB
  },
});

//api/my-hotels
//also for creating hotels together with validations!!
router.post(
  "/",
  verifyToken,
  [body("name").notEmpty().withMessage("Name is required")],
  [body("city").notEmpty().withMessage("City is required")],
  [body("country").notEmpty().withMessage("Country is required")],
  [body("description").notEmpty().withMessage("Description is required")],
  [body("type").notEmpty().withMessage("Hotel type is required")],
  [
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
  ],
  [
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],

  upload.array("imageFiles", 6),
  hotels
);

export default router;
