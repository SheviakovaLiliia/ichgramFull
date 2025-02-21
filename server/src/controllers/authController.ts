import { Request, Response, RequestHandler, NextFunction } from "express";
import User, { UserType } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";
import nodemailer from "nodemailer";
import { TokenPayload } from "../types/express";
import crypto from "crypto";
import "dotenv/config";

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res
        .status(400)
        .json({ message: "User with such username or email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      full_name: fullName,
      username: username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User has been registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      res
        .status(400)
        .json({ message: "Username or email and password are required" });
      return;
    }

    const user: UserType | null = await User.findOne({
      $or: [{ email: login }, { username: login }],
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Email or password is incorrect" });
      return;
    }

    if (process.env.JWT_SECRET) {
      const userInfo: TokenPayload = {
        username: user.username,
        userId: user._id.toString(),
      };
      const token = jwt.sign(
        userInfo,
        // { userId: user._id.toString(), username: user.username },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 3600 * 1000,
      });

      res.status(200).json({
        message: "Logged in successfully",
        user: user,
        data: {
          username: user.username,
          userId: user._id,
          profile_image: user.profile_image,
        },
      });
    } else {
      res.status(401).send("Something went wrong");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const checkAuthStatus = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ authenticated: false });
      return;
    }

    interface JwtPayload {
      username: string;
      userId: string;
    }

    if (process.env.JWT_SECRET) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      const user = await User.findOne({ username: decoded.username }).select(
        "-password"
      );

      if (!user) {
        res.status(401).json({ authenticated: false });
        return;
      }

      res.status(200).json({ authenticated: true, user: user.username });
    } else {
      res.status(401).json({ authenticated: false });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ authenticated: false });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging user out" });
  }
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL, // must be real
    pass: process.env.GMAILPASS, // must be real
  },
});

export const resetPassword = async (req: Request, res: Response) => {
  const { emailOrUsername } = req.body;

  console.log(emailOrUsername);

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // if (!user) {

    //   return res
    //     .status(200)
    //     .json({ message: "If the account exists, an email has been sent." });
    // }

    // generating token for reset
    const resetToken = crypto.randomBytes(32).toString("hex");
    // const resetPasswordExpires = Date.now() + 3600000; // 1 hour

    // Saving token in db
    // user.resetPasswordToken = resetToken;
    // user.resetPasswordExpires = resetPasswordExpires;
    // await user.save();

    // const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Sending letter
    // const mailOptions = {
    //   to: user.email,
    //   subject: "Password Reset",
    //   html: `
    //       <p>You requested a password reset.</p>
    //       <p>Click the link below to reset your password:</p>
    //       <a href="${resetUrl}">${resetUrl}</a>
    //       <p>If you didn't request this, please ignore this email.</p>
    //     `,
    // };

    // await transporter.sendMail(mailOptions);

    const resetData = {
      token: resetToken,
      username: user.username,
    };

    res.status(200).json(resetData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ json: "Internal Server Error" });
  }
};

export const resetPasswordStep2 = async (req: Request, res: Response) => {
  // const { token } = req.params;
  const { password, username } = req.body;

  try {
    // const user = await User.findOne({
    //   resetPasswordToken: token,
    //   resetPasswordExpires: { $gt: Date.now() },
    // });

    const user = await User.findOne({ username });

    // if (!user) {
    //   return res.status(400).json({ message: "Invalid or expired token." });
    // }

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // Хэшируем новый пароль
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    // user.resetPasswordToken = undefined;
    // user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been successfully reset" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    // const token = req.cookies?.token;
    //   if (!token) {
    //     return res
    //       .status(401)
    //       .json({ message: "Unauthorized: No token provided" });
    //   }

    //   // Verify the old token
    //   jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    //     if (err) {
    //        res
    //         .status(403)
    //         .json({ message: "Forbidden: Invalid or expired token" });
    //         return
    //     }

    // Find the user associated with the token
    const user = await User.findOne({ username: (req.user as any).username });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Generate a new token
    if (process.env.JWT_SECRET) {
      const newToken = jwt.sign(
        { userId: user._id.toString(), username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Set the new token in cookies
      res.cookie("token", newToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 3600 * 1000,
      });

      res.status(200).json({ message: "Token refreshed successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error refreshing token", error });
  }
};
