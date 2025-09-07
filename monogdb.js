import { MongoClient } from "mongodb";
import config from "./config.js";

let db;

export async function connectToDb() {
  const client = new MongoClient(config.MONGODB_URI);
  await client.connect();
  db = client.db("SkillSwapDB"); // will auto-create this db
  console.log("✅ Connected to MongoDB");
}

export function getDb() {
  if (!db) throw new Error("DB not initialized");
  return db;
}