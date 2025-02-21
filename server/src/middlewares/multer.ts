import multer from "multer";
import { Request } from "express";

export interface MulterRequest extends Request {
  file: Express.Multer.File;
}

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 5024 * 5024 } });

export const uploadImageMiddleware = upload.single("image");
