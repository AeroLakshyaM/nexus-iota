import { MongoClient } from "mongodb";
import config from "./config.js";

let db;

export async function connectToDb() {
  try {
    const client = new MongoClient(config.MONGODB_URI);
    await client.connect();
    db = client.db("nexus"); // Using nexus database
    console.log("✅ Connected to MongoDB");
    return client;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

export function getDb() {
  if (!db) throw new Error("DB not initialized");
  return db;
} 