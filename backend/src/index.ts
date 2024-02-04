import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

//Connect to database
mongoose.connect(process.env.MONGO_URL as string);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/test", async (req: Request, res: Response) => {
  res.json({ message: "Hello from express" });
});

app.listen(3000, () => {
  console.log("Connected to port 3000");
});
