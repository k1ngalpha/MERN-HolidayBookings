import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get(
  "/current-user",
  verifyToken,
  async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ mesage: "Something went wrong" });
    }
  }
);

router.post(
  "/register",
  [
    check("firstName", "First Name is required!").isString(),
    check("lastName", "Last Name is required!").isString(),
    check("email", "email is required!").isEmail(),
    check(
      "password",
      "Password with 6 or more characters is required!"
    ).isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      //Check if the user email already exists
      let user = await User.findOne({
        email: req.body.email,
      });
      if (user) {
        return res.status(400).json({ message: "User already exists!" });
      }
      //Create new user
      user = new User(req.body);
      await user.save();

      //Add JWT
      const token = jwt.sign(
        {
          userId: user.id,
        },
        process.env.JWT_TOKEN as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      return res.status(200).send({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).send({ message: "Internal server error!" });
    }
  }
);

export default router;
