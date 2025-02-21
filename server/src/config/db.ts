import mongoose from "mongoose";
import "dotenv/config";

const mongoURI: string = process.env.MONGO_URI || "mongodb://localhost:27017";

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Couldn't connect to MongoDB", error);
    process.exit(1);
  }
};
