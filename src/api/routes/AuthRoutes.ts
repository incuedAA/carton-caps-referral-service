import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateRequest } from "../middlewares/validateSchema";
import { AuthorizeRequest } from "../dtos/auth.dto";

const createAuthRoutes = (controller: AuthController): Router => {
  const router = Router();

  /**
   * @swagger
   * /api/auth/authorize:
   *   post:
   *     tags:
   *       - Client
   *     summary: Generate a JWT token for clients
   *     description: Authenticate the client and return a JWT token. Only available in development mode. At the time of writing this, the endpoint will return a token containing the ID of whatver user ID is provided in the request body. In production, use the token provided by the core API instead.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - userId
   *             properties:
   *               userId:
   *                 type: string
   *                 minLength: 1
   *     responses:
   *       '200':
   *         description: JWT token generated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *       '422':
   *         description: >-
   *           Validation error (e.g., missing or invalid userId).
   *           Unique code: AUTH_422
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: object
   *       '401':
   *         description: Unauthorized. This endpoint is only available in development mode.
   *       '400':
   *         description: Bad request. Missing or invalid userId.
   *       '500':
   *         description: Internal server error
   */

  router.post(
    "/authorize",
    validateRequest(AuthorizeRequest),
    (req, res, next) => controller.authorize(req, res, next),
  );

  return router;
};
export default createAuthRoutes;
