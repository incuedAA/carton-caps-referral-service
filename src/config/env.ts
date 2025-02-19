import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const config = {
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
  },
  api: {
    prefix: process.env.API_PREFIX || "/api",
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === "true",
    path: process.env.SWAGGER_PATH || "/docs",
  },
  auth: {
    clientSecret: process.env.CLIENT_SECRET || "clientsecret",
    serverSignatureSecret:
      process.env.SERVER_SIGNATURE_SECRET || "serversecret",
  },
};
