import { ConvertReferralErrorCode } from "../models/ConvertReferralErrorCode";
import { User } from "../models/User";

export interface ValidationResult {
  valid: boolean;
  error?: ConvertReferralErrorCode;
}

export class ReferralValidationError extends Error {
  constructor(
    message: string,
    public code: ConvertReferralErrorCode,
  ) {
    super(message);
    this.name = "ReferralValidationError";
  }
}

export interface IReferralRateLimitValidator {
  validateRateLimit(referringUserId: string): Promise<boolean>;
}

export interface IPhoneNumberValidationService {
  validatePhoneNumberUsage(
    referrerPhone: string,
    newUserPhone: string,
  ): Promise<boolean>;
}

export interface IReferralValidationService {
  validateReferral(
    newUser: User,
    referringUser: User,
  ): Promise<ValidationResult>;
}
