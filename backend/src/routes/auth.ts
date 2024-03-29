import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/user";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check(
      "password",
      "Password with 6 or more characters is required"
    ).isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    //Check for any errors in the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        email,
      });

      //If the user does not exists
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials!" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      //If the password doesnt match
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials!" });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_TOKEN as string,
        { expiresIn: "1d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      res.status(200).json({ userId: user._id });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

export default router;

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  res.send();
});
