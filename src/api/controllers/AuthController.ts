import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config/env";
import { AuthorizeRequest, AuthorizeResponse } from "../dtos/auth.dto";
import { ErrorResponse, createErrorResponse } from "../dtos/error.dto";
/**
 * Controller for the auth routes
 */
export class AuthController {
  /** Authorizes a client to access the API */
  async authorize(
    req: Request<unknown, AuthorizeRequest | ErrorResponse, AuthorizeRequest>,
    res: Response<AuthorizeResponse | ErrorResponse>,
    next: NextFunction,
  ) {
    try {
      // disable endpoint in production
      if (config.server.nodeEnv !== "development") {
        return res.status(401).json({
          message:
            "Unauthorized. This endpoint is only available in development mode.",
        });
      }

      const { userId } = req.body;
      // validate the userId is present in the request body
      if (!userId) {
        throw new Error("userId is required.");
      }

      const secret = config.auth.clientSecret;
      const payload = { userId, role: "client" };
      const token = jwt.sign(payload, secret, { expiresIn: "1h" });

      return res.json({ token });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json(createErrorResponse(error.message));
      }
      next(error);
    }
  }
}
