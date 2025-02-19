import { UserClaims } from "./src/api/dtos/auth.dto";
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: UserClaims;
    }
  }
}

export {};
