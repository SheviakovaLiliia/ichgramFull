import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";
import { TokenPayload } from "../types/express";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      console.error("Token is expired or invalid!");
      res.status(401).json({ message: "Access denied" });
      return;
    }

    if (token && process.env.JWT_SECRET) {
      jwt.verify(
        token,
        process.env.JWT_SECRET,
        (
          err: VerifyErrors | null,
          decoded: JwtPayload | string | undefined
        ) => {
          if (err) {
            res.status(403).send("Forbidden: Invalid or expired token");
            return;
          }
          req.user = decoded as TokenPayload;
          next();
        }
      );
    }
  } catch (error) {
    res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
};

export default authMiddleware;
