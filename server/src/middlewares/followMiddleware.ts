import { Request, Response, NextFunction } from "express";
import User, { UserType } from "../models/userModel";

interface CustomRequest extends Request {
  user: {
    userId: string;
    username: string;
  };
}

export const ifFollowed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;
  if (!username) {
    res.status(400).json({ message: "Username is required" });
    return;
  }

  const user: UserType | null = await User.findOne({ username });
  const me: UserType | null = await User.findById(
    (req as CustomRequest).user.userId
  );
  if (!me || !user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  (req as any).followed = user.followers.includes(me._id);
  (req as any).me = me;
  (req as any).targetUser = user;
  next();
};
