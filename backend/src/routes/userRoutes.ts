import express from "express";
import { loginUser, registerUsers } from "../controllers/userControllers";
import { check } from "express-validator";
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

export default router;
