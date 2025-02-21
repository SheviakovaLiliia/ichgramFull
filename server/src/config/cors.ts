import { CorsOptions } from "cors";
import "dotenv/config";

export const configureCors = (): CorsOptions => {
  const clientHost =
    process.env.ENV === "local"
      ? "http://localhost:5173"
      : process.env.CLIENT_HOST;
  return {
    origin: `${clientHost}`,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    credentials: true,
  };
};
