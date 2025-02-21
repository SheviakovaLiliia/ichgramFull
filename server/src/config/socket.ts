import { Server } from "socket.io";
import http from "http";
import Chat from "../models/chatModel";
import Message from "../models/messageModel";
import "dotenv/config";

export const initializeSocket = (server: http.Server) => {
  const origin = process.env.CLIENT_URL || "http://localhost:5173";
  const io = new Server(server, {
    cors: {
      origin: origin,
    },
  });

  io.on("connection", (socket) => {
    //console.log("A user connected:", socket.id);

    // Assign the user to a room based on their ID
    socket.on("joinRoom", (userId: string) => {
      socket.join(userId);
      //console.log(`User ${userId} joined their room: ${userId}`);
    });

    // Listen for a new message event
    socket.on("sendMessage", async ({ authorId, receiverId, content }) => {
      try {
        // Find or create the chat between users
        //console.log("sendMessage", content);
        let chat = await Chat.findOne({
          $or: [
            { user1: authorId, user2: receiverId },
            { user1: receiverId, user2: authorId },
          ],
        });

        if (!chat) {
          chat = new Chat({
            user1: authorId,
            user2: receiverId,
          });
          await chat.save();
        }

        // Save the new message
        const newMessage = await Message.create({
          author: authorId,
          receiver: receiverId,
          content: content,
          chat: chat._id,
        });

        // Update chat with the new message
        chat.messages.push(newMessage._id);
        chat.last_message = newMessage._id;
        await chat.save();

        await newMessage.populate({
          path: "author",
          select: "username profile_image",
        });
        await newMessage.populate({
          path: "receiver",
          select: "username profile_image",
        });

        // Emit the new message to the receiver's room
        io.to(chat._id.toString()).emit("receiveMessage", newMessage);

        // console.log("Message saved and sent to receiver:", newMessage);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("disconnect", () => {
      // console.log("A user disconnected:", socket.id);
    });
  });
};
