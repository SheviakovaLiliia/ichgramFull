import express from "express";

export interface TokenPayload {
  username: string;
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
