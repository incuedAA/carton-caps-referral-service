import { Request, Response, NextFunction } from "express";
import { CreateReferralLink } from "../../use-cases/CreateReferralLink";
import { GetReferralsUseCase } from "../../use-cases/GetReferralsUseCase";
import { ConvertReferralUseCase } from "../../use-cases/ConvertReferralUseCase";
import { ErrorResponse, createErrorResponse } from "../dtos/error.dto";
import {
  ConvertReferralRequest,
  ConvertReferralResponse,
  CreateReferralDeepLinkRequest,
  CreateReferralDeepLinkResponse,
  GetReferralsRequest,
  GetReferralsResponse,
} from "../dtos/referral.dto";
import { AuthorizedServerRequest } from "../dtos/auth.dto";

/**
 * Controller for the referral routes
 */
export class ReferralController {
  constructor(
    private createReferralLinkUseCase: CreateReferralLink,
    private getReferralsUseCase: GetReferralsUseCase,
    private convertReferralUseCase: ConvertReferralUseCase,
  ) {}
  // Get user information from EXISTING user service, since that it currently the source of truth for user information.
  // While we could accept the referral code directly from the client, it's best to keep the business logic in the server,
  // Generate a basic unique id, in production use a robust generator

  async createReferralDeepLink(
    req: Request<
      unknown,
      CreateReferralDeepLinkResponse | ErrorResponse,
      CreateReferralDeepLinkRequest
    >,
    res: Response<CreateReferralDeepLinkResponse | ErrorResponse>,
    next: NextFunction,
  ) {
    try {
      // get user id from user claims, user can only create referral link for themselves
      // In the future, we could allow the core server to create referral links for other users, but for now we'll keep it simple
      const referringUserId = req.user?.userId;
      if (!referringUserId) {
        throw new Error("User ID is required");
      }

      const referral =
        await this.createReferralLinkUseCase.execute(referringUserId);
      res.status(201).json(referral);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.stack);
        res.status(500).json(createErrorResponse(error.message));
      } else {
        next(error);
      }
    }
  }
  // get all referrals for a specific user.
  // in the future we could allow pagination & the ability for the core server to get referrals for other users
  async getReferrals(
    req: Request<unknown, GetReferralsRequest | ErrorResponse>,
    res: Response<GetReferralsResponse | ErrorResponse>,
    next: NextFunction,
  ) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json(createErrorResponse("User not authenticated"));
      }
      const userId = req.user.userId;
      const referrals = await this.getReferralsUseCase.execute(userId);
      res.status(200).json({ referrals });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.stack);
        res.status(500).json(createErrorResponse(error.message));
      } else {
        next(error);
      }
    }
  }
  // server-to-server called by the core server to check that a referral can be used upon a new user registration
  // Should be called AFTER the user has been created, but BEFORE the referral is converted
  // for the sake of a quicker response, we ask the core server to send the full user object, instead of making a duplicate call to the user service
  // in the future we could allow pagination & the ability for the core server to get referrals for other users
  // This service in charge of referrals, so it's responsible for validating that a referral can be used upon a new user registration
  async convertReferral(
    req: AuthorizedServerRequest<
      unknown,
      ConvertReferralResponse | ErrorResponse,
      ConvertReferralRequest
    >,
    res: Response<ConvertReferralResponse | ErrorResponse>,
    next: NextFunction,
  ) {
    try {
      const { referralCode, newUser } = req.body;
      const convertedReferral = await this.convertReferralUseCase.execute(
        referralCode,
        newUser,
      );

      res.status(200).json(convertedReferral);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json(createErrorResponse(error.message));
      } else {
        next(error);
      }
    }
  }
}
