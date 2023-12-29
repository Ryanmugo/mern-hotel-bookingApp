import express, { NextFunction, Request, Response } from "express";
import {
  loginUser,
  logoutUser,
  registerUsers,
} from "../controllers/userControllers";
import { check } from "express-validator";
import { verifyToken } from "../middlewares/auth";

const router = express.Router();

//regstering a user!!
router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  registerUsers
);

//loging in a user!!
router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  loginUser
);

//Validation of tokens!!
router.get(
  "/validate-token",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ userId: req.userId });
  }
);

//Logout
router.post("/logout", logoutUser);

export default router;
