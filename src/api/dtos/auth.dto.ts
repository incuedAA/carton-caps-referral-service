import { IsString, MinLength } from "class-validator";
import { Request } from "express";

import jwt from "jsonwebtoken";

export interface UserClaims extends jwt.JwtPayload {
  userId: string;
  role: "client" | "server";
  iat: number;
  exp: number;
}
// used to validate the request body for the authorize endpoint
export class AuthorizeRequest {
  @IsString()
  @MinLength(1, { message: "userId is required" })
  userId?: string;
}
// Generic interface used for authorized requests
export interface AuthorizedClientRequest<
  P = unknown,
  ResBody = unknown,
  ReqBody = unknown,
> extends Request<P, ResBody, ReqBody> {
  user: UserClaims;
}
// Generic interface
export interface AuthorizedServerRequest<
  P = unknown,
  ResBody = unknown,
  ReqBody = unknown,
> extends Request<P, ResBody, ReqBody> {
  // identifies the service that is making the request, use for tracing requests between services
  service?: string;
}

export interface AuthorizeResponse {
  token: string;
}
