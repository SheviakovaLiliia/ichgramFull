import { Request, Response } from "express";
import User, { UserType } from "../models/userModel";
import mongoose from "mongoose";
import { cloudinary } from "../config/cloudinary";
import Notification from "../models/notificationModel";
import "dotenv/config";
import jwt from "jsonwebtoken";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      res.status(400).json("Username is required");
      return;
    }

    const user = await User.findOne({ username })
      .select("-password")
      .select("-notifications -search");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const owner = await User.findOne({ username: (req.user as any).username });

    if (!owner) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isOwner = user.username === (req.user as any).username;
    const isFollowedByOwner = owner.followings.some(
      (f) => f.toString() === user._id.toString()
    );

    const modifiedUser = {
      ...user.toObject(),
      isOwner,
      isFollowedByOwner,
      post_count: user.posts.length,
      followings_count: user.followings.length,
      followers_count: user.followers.length,
    };

    res.status(200).json(modifiedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

export const getAuthenticatedUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: "Token is invalid or expired" });
      return;
    }

    const decoded = jwt.verify(token, (process.env as any).JWT_SECRET);

    const user = await User.findOne({ username: (decoded as any).username })
      .select("-password -notifiations")
      .populate("search", "username profile_image");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const modifiedUser = {
      ...user.toObject(),
      isOwner: true,
      isFollowedByOwner: false,
      post_count: user.posts.length,
      followings_count: user.followings.length,
      followers_count: user.followers.length,
    };

    res.status(200).json(modifiedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { bio, website, newUsername } = req.body;

    if (!bio || !website || !newUsername) {
      res
        .status(400)
        .json({ message: "Bio, website and newUsername are required" });
      return;
    }

    if (newUsername !== username) {
      const existingUser = await User.findOne({ username: newUsername });
      if (existingUser) {
        res.status(400).json({ message: "Username already exists" });
        return;
      }
    }

    if (
      newUsername.length > 0 &&
      newUsername !== user.username &&
      newUsername.length <= 120
    )
      user.username = newUsername;
    if (
      website.length > 0 &&
      website !== user.username &&
      website.length <= 120
    )
      user.bio_website = website;
    if (bio.length > 0 && bio.length <= 150 && bio !== user.bio) user.bio = bio;

    if (req.file) {
      const base64Image = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      const uploadedImage = await cloudinary.uploader.upload(base64Image, {
        folder: "profile_images",
        resource_type: "image",
      });

      const profileImageUrl = uploadedImage.secure_url;
      user.profile_image = profileImageUrl;
    }
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile", error });
  }
};

export const searchUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({}, "username profile_image");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users: ", error);
    res.status(500).json({ message: "Error searching users" });
  }
};

export const addUserToSearch = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    if (!username || !req.user) {
      res.status(400).json({ message: "Users must be provided" });
      return;
    }
    const user = await User.findById(req.user.userId);
    const searchedUser = await User.findOne({ username });
    if (!user || !searchedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.search.push(searchedUser._id);
    await user.save();
    res.status(200).json({ message: "User added to search successfully" });
  } catch (error) {
    console.error("Error adding user to search");
    res.status(500).json({ message: "Error adding user to search results" });
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).targetUser;
    const me = (req as any).me;
    const followed = (req as any).followed;

    if (followed) {
      res.status(404).json({ message: "User is already followed" });
      return;
    }

    user.followers.push(me._id);
    me.followings.push(user._id);
    const newNotification = await Notification.create({
      user: user._id,
      sender: me._id,
      type: "started following you",
    });
    user.notifications.push(newNotification._id);
    await me.save();
    await user.save();

    res.status(201).json({
      _id: user._id,
      profile_image: user.profile_image,
      username: user.username,
    });
  } catch (error) {
    console.error("Error following a user: ", error);
    res.status(500).json({ message: "Error following a user" });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).targetUser;
    const me = (req as any).me;
    const followed = (req as any).followed;

    if (!followed) {
      res.status(404).json({ message: "Following not found" });
      return;
    }

    user.followers = user.followers.filter(
      (f: mongoose.Types.ObjectId) => !f._id.equals(me._id)
    );
    me.followings = me.followings.filter(
      (f: mongoose.Types.ObjectId) => !f._id.equals(user._id)
    );
    await me.save();
    await user.save();
    res.status(200).json({
      _id: user._id,
      profile_image: user.profile_image,
      username: user.username,
    });
  } catch (error) {
    console.error("Error deleting following: ", error);
    res.status(500).json({ message: "Error deleting following" });
  }
};
