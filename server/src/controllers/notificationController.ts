import { Response, Request } from "express";
import Notification from "../models/notificationModel";
import User from "../models/userModel";
import mongoose from "mongoose";

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({
      user: (req.user as any).userId,
    })
      .sort({
        createdAt: -1,
      })
      .populate([
        {
          path: "post",
          select: "image",
        },
        {
          path: "comment",
          populate: [
            {
              path: "post",
              select: "image",
            },
          ],
        },
        {
          path: "sender",
          select: "username profile_image",
        },
      ]);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// export const markNotificationRead = async (req: Request, res: Response) => {
//   try {
//     const { notificationId } = req.params;

//     if (!notificationId) {
//       res.status(400).json({ message: "Notification Id is required" });
//       return;
//     }

//     const notification = await Notification.findByIdAndUpdate(
//       notificationId,
//       { read: true },
//       { new: true }
//     );

//     res.status(200).json(notification);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating notification" });
//   }
// };

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      res.status(400).json({ message: "Notification Id is required" });
      return;
    }

    const notification = await Notification.findByIdAndDelete(notificationId);

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification" });
  }
};

// export const markAllNotificationsRead = async (req: Request, res: Response) => {
//   try {
//     const notifications = await Notification.updateMany(
//       { user: (req.user as any).userId },
//       { read: true }
//     );
//     res.status(200).json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating notifications" });
//   }
// };

// export const deleteAllNotifications = async (req: Request, res: Response) => {
//   try {
//     const notifications = await Notification.deleteMany({
//       user: (req.user as any).userId,
//     });

//     res.status(200).json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting notifications" });
//   }
// };

export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    console.log("Start deleting");
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    console.log("Middle");
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // const userId = new mongoose.Types.ObjectId((req.user as any).userId);

    const notifications = await Notification.deleteMany({ user: user._id });
    console.log("Middle2");
    if (notifications.deletedCount === 0) {
      res.status(404).json({ message: "No notifications to delete" });
      return;
    }

    await User.updateOne({ _id: user._id }, { $set: { notifications: [] } });

    // res
    //   .status(200)
    //   .json({ success: true, deletedCount: notifications.deletedCount });
    console.log("End");
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ message: "Error deleting notifications" });
  }
};
