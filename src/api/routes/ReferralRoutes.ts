import { Router } from "express";
import { ReferralController } from "../controllers/ReferralController";
import { clientAuthMiddleware } from "../middlewares/clientAuth";
import { serverAuthMiddleware } from "../middlewares/serverAuth";
import { validateRequest } from "../middlewares/validateSchema";
import {
  ConvertReferralRequest,
  CreateReferralDeepLinkRequest,
} from "../dtos/referral.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     ReferralStatus:
 *       type: string
 *       enum: [PENDING, COMPLETED, FAILED]
 *       description: Status of a referral
 *     ConvertReferralErrorCode:
 *       type: string
 *       enum: [REFERRAL_NOT_FOUND, SAME_PHONE_NUMBER_USED, RATE_LIMIT_EXCEEDED, UNKNOWN_ERROR]
 *       description: Error codes for referral conversion failures
 */

export const createReferralRoutes = (
  controller: ReferralController,
): Router => {
  const router = Router();

  /**
   * @swagger
   * /api/referrals/deep-link:
   *   post:
   *     tags:
   *       - Client
   *     summary: Create a new referral
   *     security:
   *       - bearerAuth: []
   *     description: Create a new referral with deep link generation. Because this is called from the client, user ID will be taken from their authorization claims.
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       '201':
   *         description: Referral created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 deepLink:
   *                   type: string
   *       '422':
   *         description: >-
   *           Validation error (e.g., missing or invalid fields for creating referral).
   *           Unique code: REF_CREATE_422
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: object
   *       '401':
   *         description: Unauthorized. Missing or invalid token.
   *       '500':
   *         description: Internal server error
   */
  router.post(
    "/referrals/deep-link",
    clientAuthMiddleware,
    validateRequest(CreateReferralDeepLinkRequest),
    (req, res, next) => controller.createReferralDeepLink(req, res, next),
  );

  /**
   * @swagger
   * /api/referrals:
   *   get:
   *     tags:
   *       - Client
   *     summary: Get all referrals
   *     security:
   *       - bearerAuth: []
   *     description: >-
   *       Retrieve all referrals for the authenticated user.
   *       Currently, only COMPLETED referrals are returned, which are referrals where the referred user has successfully registered and passed all validation checks.
   *       In the future, this may be expanded to include PENDING and FAILED referrals for better tracking and fraud detection.
   *     responses:
   *       '200':
   *         description: List of referrals retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 referrals:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       referringUserId:
   *                         type: string
   *                       referreeUserId:
   *                         type: string
   *                       status:
   *                         $ref: '#/components/schemas/ReferralStatus'
   *                       convertedUser:
   *                         type: object
   *                       convertedAt:
   *                         type: string
   *                         format: date-time
   *       '401':
   *         description: Unauthorized. Missing or invalid token.
   *       '500':
   *         description: Internal server error
   */
  router.get("/referrals", clientAuthMiddleware, (req, res, next) =>
    controller.getReferrals(req, res, next),
  );

  /**
   * @swagger
   * /api/referrals/convert:
   *   post:
   *     tags:
   *       - Server
   *     summary: Convert a referral on registration (server only)
   *     security:
   *       - serverAuth: []
   *     description: >-
   *       Convert a referral by providing the referral code and new user details.
   *       This endpoint is meant to be called from the core user server on user registration.
   *
   *       To prevent abuse and fraudulent referrals, the following validations are performed:
   *       1. Rate Limiting: A user can only convert up to 10 referrals in a 24-hour period
   *       2. Phone Number Check: The referrer cannot use the same phone number as the person they referred
   *
   *       If any of these validations fail, the referral will not be converted and an appropriate error code will be returned.
   *       These validations help maintain the integrity of the referral program and prevent gaming of the system.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               referralCode:
   *                 type: string
   *               newUser:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   email:
   *                     type: string
   *                   firstName:
   *                     type: string
   *                   lastName:
   *                     type: string
   *                   phoneNumber:
   *                     type: string
   *                   dob:
   *                     type: string
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   *                   referralCode:
   *                     type: string
   *     responses:
   *       '200':
   *         description: Referral converted successfully
   *         content:
   *           application/json:
   *             schema:
   *               oneOf:
   *                 - type: object
   *                   properties:
   *                     converted:
   *                       type: boolean
   *                       example: true
   *                     referral:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                         referringUserId:
   *                           type: string
   *                         referreeUserId:
   *                           type: string
   *                         status:
   *                           $ref: '#/components/schemas/ReferralStatus'
   *                         convertedUser:
   *                           type: object
   *                         convertedAt:
   *                           type: string
   *                           format: date-time
   *                 - type: object
   *                   properties:
   *                     converted:
   *                       type: boolean
   *                       example: false
   *                     code:
   *                       $ref: '#/components/schemas/ConvertReferralErrorCode'
   *       '422':
   *         description: >-
   *           Validation error (e.g., missing or invalid fields for referral conversion).
   *           Unique code: REF_CONVERT_422
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: object
   *       '400':
   *         description: Conversion failed due to business rule violation
   *       '401':
   *         description: Unauthorized. Missing or invalid X-Signature header.
   *       '500':
   *         description: Internal server error
   */
  router.post(
    "/referrals/convert",
    serverAuthMiddleware,
    validateRequest(ConvertReferralRequest),
    (req, res, next) => controller.convertReferral(req, res, next),
  );

  return router;
};
