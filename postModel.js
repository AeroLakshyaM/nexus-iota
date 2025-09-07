import { getDb } from "./mongodb.js";
import { ObjectId } from "mongodb";

export async function createPost(userId, data) {
  const db = getDb();
  const { title, description, wantSkills, offerSkills, availability } = data;
  const post = await db.collection("posts").insertOne({
    title,
    description,
    wantSkills,
    offerSkills,
    availability,
    userId,
    createdAt: new Date(),
  });
  const user = await db.collection("users").findOne(
    { _id: new ObjectId(userId) },
    { projection: { name: 1, email: 1 } }
  );
  return {
    _id: post.insertedId,
    title,
    description,
    wantSkills,
    offerSkills,
    availability,
    user: { name: user?.name || 'Unknown', email: user?.email },
    createdAt: new Date(),
  };
}

export async function getAllPosts() {
  const db = getDb();
  const posts = await db.collection("posts").find().sort({ createdAt: -1 }).toArray();
  return await Promise.all(
    posts.map(async (post) => {
      const user = await db.collection("users").findOne(
        { _id: new ObjectId(post.userId) },
        { projection: { name: 1, email: 1 } }
      );
      return {
        ...post,
        user: { name: user?.name || 'Unknown', email: user?.email },
      };
    })
  );
} 