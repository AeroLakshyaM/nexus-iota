import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../mongodb.js";
import { ObjectId } from "mongodb";
import config from "../config.js";
import * as PostModel from '../postModel.js';

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const db = getDb();
  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const userProfile = {
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
    title: "",
    location: "",
    phone: "",
    bio: "",
    avatar: "",
    coverImage: "",
    stats: { projects: 0, followers: 0, following: 0, likes: 0 },
    skills: { design: [], development: [] },
    experience: [],
    projects: [],
    achievements: [],
    socialLinks: { github: "", linkedin: "", twitter: "", website: "" },
    isPublic: true,
  };
  const user = await db.collection("users").insertOne(userProfile);
  const token = jwt.sign({ id: user.insertedId }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE });
  res.status(201).json({ token, userId: user.insertedId });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // Set session
  req.session.userId = user._id.toString();

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE });
  res.json({ token, userId: user._id });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

function authMiddleware(req, res, next) {
  // Prefer session
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    return next();
  }
  // Fallback to JWT
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

router.get("/dashboard", authMiddleware, async (req, res) => {
  const db = getDb();
  const user = await db.collection("users").findOne(
    { _id: new ObjectId(req.userId) },
    { projection: { password: 0 } }
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  const db = getDb();
  const allowedFields = [
    "name", "title", "location", "phone", "bio", "avatar", "coverImage", "stats", "skills", "experience", "projects", "achievements", "socialLinks", "isPublic"
  ];
  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  try {
    await db.collection("users").updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: updates }
    );
    const updatedUser = await db.collection("users").findOne(
      { _id: new ObjectId(req.userId) },
      { projection: { password: 0 } }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// Posts routes
router.post("/posts", authMiddleware, async (req, res) => {
  try {
    const postWithUser = await PostModel.createPost(req.userId, req.body);
    res.status(201).json(postWithUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
});

router.get("/posts", async (req, res) => {
  try {
    const postsWithUsers = await PostModel.getAllPosts();
    res.json(postsWithUsers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

export default router;