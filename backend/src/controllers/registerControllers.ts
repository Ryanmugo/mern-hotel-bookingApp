import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

//We are registering all users!!
export const registerUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Sorry, something went wrong!" });
  }
};
