/* global process */
import express from "express";
import cors from "cors";
import authRoutes from "./Routes/auth.js";
import { connectToDb } from "./monogdb.js";
import config from "./config.js";
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "nexus_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    sameSite: "lax",
  },
}));
app.use("/api/auth", authRoutes);

app.get("/", (_, res) => res.send("✅ Skill Swap Backend Running"));

connectToDb().then(() => {
  app.listen(config.PORT, () => console.log(`🚀 Server running on port ${config.PORT}`));
});