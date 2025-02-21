import mongoose, { Document } from "mongoose";

export interface UserType extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  full_name: string;
  password: string;
  bio: string;
  bio_website: string;
  profile_image: string;
  notifications: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
  followings: mongoose.Types.ObjectId[];
  search: mongoose.Types.ObjectId[];
  created_at: Date;
}

const userSchema = new mongoose.Schema<UserType>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  full_name: { type: String, required: true },
  bio: { type: String, default: "" },
  bio_website: { type: String, default: "" },
  profile_image: {
    type: String,
    default:
      "https://res.cloudinary.com/dw2kfk2ju/image/upload/v1739188716/profile_img_dvbisn.png",
  },
  notifications: [{ type: mongoose.Types.ObjectId, ref: "Notification" }],
  posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
  followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  followings: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  search: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
