import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  like_count: { type: Number, required: true, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
