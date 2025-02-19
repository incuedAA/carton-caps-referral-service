import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import { config } from "./env";
import { createReferralRoutes } from "../api/routes/ReferralRoutes";
import { ReferralController } from "../api/controllers/ReferralController";
import { CreateReferralLink } from "../use-cases/CreateReferralLink";
import { GetReferralsUseCase } from "../use-cases/GetReferralsUseCase";
import { ReferralRepository } from "../infrastructure/database/ReferralRepository";
import { DeepLinkService } from "../infrastructure/deep-link/DeepLinkService";
import { ConvertReferralUseCase } from "../use-cases/ConvertReferralUseCase";
import { ReferralValidationService } from "../infrastructure/validation/ReferralValidationService";
import { UserApiService } from "../infrastructure/api/UserApiService";
import createAuthRoutes from "../api/routes/AuthRoutes";
import { AuthController } from "../api/controllers/AuthController";
const app = express();

// Middleware
app.use(express.json());

// Dependency Injection
const referralRepository = new ReferralRepository();
const deepLinkService = new DeepLinkService();
const userService = new UserApiService();
const referralValidationService = new ReferralValidationService(
  referralRepository,
);

const createReferralLinkUseCase = new CreateReferralLink(
  deepLinkService,
  userService,
);
const getReferralsUseCase = new GetReferralsUseCase(referralRepository);
const convertReferralUseCase = new ConvertReferralUseCase(
  userService,
  referralValidationService,
  referralRepository,
);
const referralController = new ReferralController(
  createReferralLinkUseCase,
  getReferralsUseCase,
  convertReferralUseCase,
);
const authController = new AuthController();
// Routes
const referralRouter = createReferralRoutes(referralController);
app.use(config.api.prefix, referralRouter);

// Register the client auth route
const authRouter = createAuthRoutes(authController);
app.use(`${config.api.prefix}/auth`, authRouter);

// Swagger documentation route
if (config.swagger.enabled) {
  app.use(config.swagger.path, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  },
);

export default app;
