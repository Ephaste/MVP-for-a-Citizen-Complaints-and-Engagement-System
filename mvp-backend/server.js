import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import morgan from "morgan";
import userRouter from "./routes/userRoute.js";
import reponseRouter from "./routes/reponseRoute.js";
import errorHandler from "./middleWare/errorMiddleware.js";
import cookieParser from 'cookie-parser';
import { __dirname } from "./dirname.js"; 
import path from "path";

import complaintRouter from "./routes/complaintRoute.js";
// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname(import.meta.url), 'uploads')));

// Routes Middleware
app.use("/api/users", userRouter);
app.use("/api/complaints", complaintRouter);
app.use("/api/responses", reponseRouter);

// Root Route
app.get("/", (req, res) => {
  res.send("HOME PAGE");
});

// Error Middleware
app.use(errorHandler);

// Connect to MongoDB and start the server
const port = process.env.PORT || 5000;
const dbConnection = process.env.DB_CONNECTION_DEV;

mongoose.connect(dbConnection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
