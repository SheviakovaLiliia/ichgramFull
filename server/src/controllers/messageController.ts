import { Request, Response } from "express";
import User, { UserType } from "../models/userModel";
import Chat from "../models/chatModel";

export const getChatInfo = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    if (!username || !req.user) {
      res.status(400).json({ message: "Receiver and sender must be provided" });
      return;
    }
    const receiver: UserType | null = await User.findOne({
      username: username,
    });
    if (!receiver) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    let chat = await Chat.findOne({
      $or: [
        { user1: req.user.userId, user2: receiver._id },
        { user1: receiver._id, user2: req.user.userId },
      ],
    })
      .select("-messages")
      .populate({
        path: "user1",
        select: "profile_image username",
      })
      .populate({
        path: "user2",
        select: "profile_image username",
      })
      .populate({
        path: "last_message",
        populate: {
          path: "author",
          select: "username profile_image",
        },
      });

    if (!chat) {
      chat = new Chat({
        user1: req.user.userId,
        user2: receiver._id,
      });
      await chat.save();

      await chat.populate({
        path: "user1",
        select: "profile_image username",
      });
      await chat.populate({
        path: "user2",
        select: "profile_image username",
      });
      await chat.populate({
        path: "last_message",
        populate: {
          path: "author",
          select: "username profile_image",
        },
      });
    }

    const modifiedChat = {
      ...chat.toObject(),
      receiver:
        (chat as any).user1._id.toString() === req.user.userId.toString()
          ? chat.user2
          : chat.user1,
    };

    res.status(200).json(modifiedChat);
  } catch (error) {
    console.error("Error getting chat: ", error);

    res.status(500).json({ message: "Error getting chat" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    if (!username || !req.user) {
      res.status(400).json({ message: "Receiver and sender must be provided" });
      return;
    }
    const receiver: UserType | null = await User.findOne({ username });
    if (!receiver) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    let chat = await Chat.findOne({
      $or: [
        { user1: req.user.userId, user2: receiver._id },
        { user1: receiver._id, user2: req.user.userId },
      ],
    }).populate({
      path: "messages",
      select: "content createdAt",
      populate: [
        {
          path: "author",
          select: "profile_image username",
        },
      ],
    });

    if (!(chat as any).messages || (chat as any).messages.length === 0) {
      res.status(200).json([]);
      return;
    }

    res.status(200).json((chat as any).messages);
  } catch (error) {
    console.error("Error getting chat: ", error);

    res.status(500).json({ message: "Error getting chat" });
  }
};

export const getUserChats = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const chats = await Chat.find({
      $or: [{ user1: req.user.userId }, { user2: req.user.userId }],
    })
      .populate({
        path: "user1",
        select: "profile_image username",
      })
      .populate({
        path: "user2",
        select: "profile_image username",
      })
      .populate({
        path: "last_message",
        populate: {
          path: "author",
          select: "username profile_image",
        },
      });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error getting user chats: ", error);

    res.status(500).json({ message: "Error getting user chats" });
  }
};
