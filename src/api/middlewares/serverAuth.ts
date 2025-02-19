import { Request, Response, NextFunction } from "express";
import { config } from "../../config/env";

/**
 * Middleware to authenticate requests from existing REST Apis. In production, we would compute an HMAC over the request payload
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function in the middleware chain
 */
export const serverAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const signature = req.headers["x-signature"];
  if (!signature) {
    return res.status(401).json({ message: "Missing X-Signature header" });
  }

  const expectedSignature = config.auth.serverSignatureSecret;
  if (signature !== expectedSignature) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  next();
};
