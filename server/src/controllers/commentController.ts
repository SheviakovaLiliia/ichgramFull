import { Request, Response } from "express";
import Post from "../models/postModel";
import User from "../models/userModel";
import Like from "../models/likeModel";
import Notification from "../models/notificationModel";
import Comment from "../models/commentModel";

export const addComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      res.status(400).json({ message: "Id is required" });
      return;
    }
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post now found" });
      return;
    }
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ message: "Content is required" });
      return;
    }
    if (!req.user) {
      res.status(401).json({ message: "User is not authorized" });
      return;
    }
    const receiver = await User.findById(post.author);
    if (!receiver) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const newComment = await Comment.create({
      post: postId,
      author: req.user.userId,
      content: content,
    });
    post.comments.push(newComment._id);
    await newComment.save();

    const newNotification = await Notification.create({
      user: post.author,
      sender: req.user.userId,
      post: postId,
      type: "commented on your post",
    });
    receiver.notifications.push(newNotification._id);
    await post.save();
    await receiver.save();
    const populatedComment = await newComment.populate({
      path: "author",
      select: "profile_image username",
    });

    const modifiedComment = {
      ...populatedComment.toObject(),
      isLikedByUser: false,
      isAuthor: true,
    };

    res.status(201).json(modifiedComment);
  } catch (error) {
    console.error("Error uploading comment: ", error);
    res.status(500).json({ message: "Error uploading comment" });
  }
};

export const likeComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    if (!commentId) {
      res.status(400).json({ message: "Id is required" });
      return;
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment now found" });
      return;
    }

    const receiver = await User.findById(comment.author);
    if (!receiver) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const newLike = await Like.create({
      user: (req as any).user.userId,
      comment: commentId,
    });

    const newNotification = await Notification.create({
      user: comment.author,
      sender: (req as any).user.userId,
      comment: comment._id,
      type: "liked your comment",
    });

    await newLike.save();
    comment.likes.push(newLike._id);
    comment.like_count += 1;
    await comment.save();
    receiver.notifications.push(newNotification._id);
    await receiver.save();
    res.status(201).json({ message: "Like for comment created successfully" });
  } catch (error) {
    console.error("Error adding like to a comment: ", error);
    res.status(500).json({ message: "Error adding like to a comment" });
  }
};

export const unLikeComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: "Post now found" });
      return;
    }

    const like = await Like.findOne({
      user: (req as any).user.userId,
      comment: comment._id,
    });
    if (!like) {
      res.status(404).json({ message: "Like not found" });
      return;
    }

    await Like.deleteOne({ _id: like._id });

    comment.likes = comment.likes.filter(
      (likeId) => likeId.toString() !== like._id.toString()
    );
    comment.like_count -= 1;
    await comment.save();
    res.status(200).json({ message: "Like deleted successfully" });
  } catch (error) {
    console.error("Error unliking a comment: ", error);
    res.status(500).json({ message: "Error unliking a comment" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    if (!commentId) {
      res.status(404).json({ message: "Id is required" });
      return;
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(204).json({ message: "Post deleted successfully" });
    console.log("Deleted successfully");
  } catch (error) {
    console.error("Error deleting a post: ", error);
    res.status(500).json({ message: "Error deleting post" });
  }
};
