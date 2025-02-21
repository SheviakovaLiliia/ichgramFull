import User, { UserType } from "../models/userModel";
import Post from "../models/postModel";
import { Request, Response } from "express";
import Like from "../models/likeModel";
import mongoose from "mongoose";
import Comment from "../models/commentModel";
import Notification from "../models/notificationModel";
import { cloudinary } from "../config/cloudinary";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!content) {
      res.status(400).json({ message: "Content is required" });
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    let postImageUrl = null;

    if (req.file) {
      const base64Image = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      const uploadedImage = await cloudinary.uploader.upload(base64Image, {
        folder: "posts",
        resource_type: "image",
      });

      postImageUrl = uploadedImage.secure_url;
    }

    const post = new Post({
      author: user._id,
      content,
      image: postImageUrl,
    });

    await post.save();
    user.posts.push(post._id);
    await user.save();

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post", error });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      res.status(400).json({ message: "Id is required" });
      return;
    }
    const post = await Post.findById(postId)
      .populate({
        path: "author",
        select: "profile_image username",
      })
      .select("-likes -comments");

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const isAuthor =
      (post.author as any).username === (req as any).user.username;

    const likes = await Post.findById(postId).select("likes").populate("likes");

    const comments = await Comment.find({ post: postId });

    const isLikedByUser = (likes as any)?.likes.some(
      (like: any) =>
        like.user.toString() === (req as any).user.userId.toString()
    );

    const postAuthorFollowers = await User.findOne({
      username: (post.author as any).username,
    }).select("followers");

    const isAuthorFollowedByUser = (postAuthorFollowers as any)?.followers.some(
      (f: any): boolean => f.toString() === (req as any).user.userId.toString()
    );

    const modifiedPost = {
      ...post.toObject(),
      isAuthor,
      isLikedByUser,
      isAuthorFollowedByUser,
      comment_count: comments.length,
    };

    //modifying post for client
    // const isAuthor =
    //   (post as any).author.username === (req as any).user.username;

    // const likes = await Post.findById(postId).select("likes").populate("likes");

    // const comments = await Comment.find({ post: postId });

    // const isLikedByUser = (likes as any).likes.some(
    //   (like: any) =>
    //     like.user.toString() === (req as any).user.userId.toString()
    // );

    // const postAuthorFollowers = await User.findOne({
    //   username: (post as any).author.username,
    // }).select("followers");

    // const isAuthorFollowedByUser = (postAuthorFollowers as any).followers.some(
    //   (f: any): boolean => f.toString() === (req as any).user.userId.toString()
    // );

    // const modifiedPost = {
    //   ...post.toObject(),
    //   isAuthor,
    //   isLikedByUser,
    //   isAuthorFollowedByUser,
    //   comment_count: comments.length,
    // };

    res.status(200).json(modifiedPost);
  } catch (error) {
    console.error("Error getting post by id: ", error);
    res.status(500).json({ message: "Error getting post by id" });
  }
};

export const getPostComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      res.status(400).json({ message: "Id is required" });
      return;
    }

    const post = await Post.findById(postId)
      .select("comments")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: [
          {
            path: "author",
            select: "profile_image username",
          },
          {
            path: "likes",
            select: "user",
          },
        ],
      });

    const modifiedComments = (post as any).comments.map((comment: any) => {
      const commentObj = comment.toObject();

      return {
        ...commentObj,
        isLikedByUser: commentObj.likes.some(
          (like: any) =>
            like.user.toString() === (req as any).user.userId.toString()
        ),
        isAuthor:
          commentObj.author._id.toString() ===
          (req as any).user.userId.toString(),
      };
    });

    res.status(200).json(modifiedComments);
  } catch (error) {
    console.error("Error getting post by id: ", error);
    res.status(500).json({ message: "Error getting post by id" });
  }
};

export const getRandomPosts = async (req: Request, res: Response) => {
  try {
    const { count } = req.query || 10;
    const countNumber = Number(count);

    const posts = await Post.aggregate([
      { $match: { author: { $ne: (req as any).user.userId } } },
      { $sample: { size: countNumber } },
      {
        $project: {
          author: 0,
          comments: 0,
          likes: 0,
          createdAt: 0,
          content: 0,
          like_count: 0,
        },
      },
    ]);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting posts: ", error);
    res.status(500).json({ message: "Error getting posts" });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      res.status(400).json({ message: "Id is required" });
      return;
    }
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
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
    const newLike = await Like.create({
      user: req.user.userId,
      post: postId,
    });
    await newLike.save();
    const newNotification = await Notification.create({
      user: post.author,
      sender: req.user.userId,
      post: postId,
      type: "liked your post",
    });
    post.likes.push(newLike._id);
    post.like_count += 1;
    await post.save();
    receiver.notifications.push(newNotification._id);
    await receiver.save();
    res.status(201).json({ message: "Like for post created successfully" });
  } catch (error) {
    console.error("Error adding like to a post: ", error);
    res.status(500).json({ message: "Error adding like to a post", error });
  }
};

export const unLikePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post || !req.user) {
      res.status(404).json({ message: "Post or user not found" });
      return;
    }

    const like = await Like.findOne({ user: req.user.userId, post: post._id });
    if (!like) {
      res.status(404).json({ message: "Like not found" });
      return;
    }

    await Like.deleteOne({ _id: like._id });

    post.likes = post.likes.filter(
      (likeId) => likeId.toString() !== like._id.toString()
    );
    post.like_count -= 1;
    await post.save();
    res.status(200).json({ message: "Like deleted successfully" });
  } catch (error) {
    console.error("Error unliking a post: ", error);
    res.status(500).json({ message: "Error unliking a post", error });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      res.status(400).json({ message: "Id is required" });
      return;
    }

    const user = await User.findOne({ username: (req.user as any).username });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.posts = user.posts.filter(
      (p: mongoose.Types.ObjectId) => !p.equals(postId)
    );

    await user.save();

    const post = await Post.deleteOne({ _id: postId });

    if (post.deletedCount === 0) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting a post: ", error);
    res.status(500).json({ message: "Error deleting post" });
  }
};

// export const deletePost = async (req: Request, res: Response) => {
//   try {
//     const { postId } = req.params;
//     if (!postId) {
//       res.status(404).json({ message: "Id is required" });
//       return;
//     }

//     const user = await User.findOne({ username: (req.user as any).username });
//     user.posts = user.posts.filter(
//       (p: mongoose.Types.ObjectId) => !p._id.equals(postId)
//     );

//     const post = await Post.deleteOne({ _id: postId });
//     await user.save();
//     res.status(200).json(post);
//   } catch (error) {
//     console.error("Error deleting a post: ", error);
//     res.status(500).json({ message: "Error deleting post" });
//   }
// };

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      res.status(400).json({ message: "postId is requied" });
      return;
    }
    const post = await Post.findById(postId);
    const { content } = req.body;
    if (!content) {
      res.status(400).json({ message: "Content is required" });
    }
    (post as any).content = content;
    await (post as any).save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating a post: ", error);
    res.status(500).json({ message: "Error updating post" });
  }
};

export const getFollowedPosts = async (req: Request, res: Response) => {
  try {
    const username = (req.user as any).username as string;
    const limit = 4;
    const page: number | null = parseInt(req.query.page as string) || 1;

    const user = await User.findOne({ username }).select("followings");

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    const posts = await Post.find({
      author: {
        $in: user.followings,
      },
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        "-author -comments -likes -like_count -content -image -createdAt"
      );

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().select(
      "-author -comments -likes -like_count -createdAt"
    );
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  const { username } = req.params;

  if (!username) {
    res.status(400).json({ message: "Username is required" });
    return;
  }

  const user = await User.findOne({ username });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  try {
    const posts = await Post.find({ author: user._id }).select(
      "-author -comments -likes -like_count -content -createdAt"
    );
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};
