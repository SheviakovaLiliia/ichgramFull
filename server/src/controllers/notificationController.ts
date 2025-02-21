import { Response, Request } from "express";
import Notification from "../models/notificationModel";

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

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      res.status(400).json({ message: "Notification Id is required" });
      return;
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification" });
  }
};

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

export const markAllNotificationsRead = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.updateMany(
      { user: (req.user as any).userId },
      { read: true }
    );
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error updating notifications" });
  }
};

export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.deleteMany({
      user: (req.user as any).userId,
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error deleting notifications" });
  }
};
