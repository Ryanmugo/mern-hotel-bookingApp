import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

//Booking
export const booking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//We are registering all users!!
export const registerUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ mesage: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    user = new User(req.body);
    await user.save();

    //Creation of token!!
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    //cookie!!
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });
    return res.status(200).send({ message: "User registered OK" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Sorry, something went wrong!" });
  }
};

//We are loging in a user!!
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Password Incorrect! Please Try Again" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });

    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//logout
export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
};
