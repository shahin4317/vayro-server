
import "dotenv/config";

import express from "express";
import cors from "cors";

import { toNodeHandler } from "better-auth/node";

import { auth } from "./lib/auth.js";
import { connectDB } from "./config/db.js";

const app = express();

const port = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Better Auth API Routes
app.all("/api/auth/*splat", toNodeHandler(auth));

// Other Routes Middleware
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("VAYRO Server Running!");
});

// Start Server
async function run() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(
        `VAYRO Server Running on Port ${port}`
      );
    });
  } catch (error) {
    console.error("Server Error:", error);
    process.exit(1);
  }
}

run();
