import { ConvertReferralErrorCode } from "../../domain/models/ConvertReferralErrorCode";
import { User } from "../../domain/models/User";
import { IReferralRepository } from "../../domain/repositories/ReferralRepository";
import {
  IReferralValidationService,
  IReferralRateLimitValidator,
  IPhoneNumberValidationService,
} from "../../domain/services/ReferralValidationService";
/**
 * This class is responsible for validating that a referral can be used upon a new user registration
 * Checking for common signs of fraudulent activity, such as the referrer and referree using the same device or phone number
 * Checking that the referrer has not exceeded the maximum number of referrals they can make in a given time period
 */

interface ValidationResult {
  valid: boolean;
  error?: ConvertReferralErrorCode;
}

export class ReferralValidationService
  implements
    IReferralValidationService,
    IReferralRateLimitValidator,
    IPhoneNumberValidationService
{
  constructor(private referralRepository: IReferralRepository) {}
  // core function to validate a referral and determine if it can be used upon a new user registration.
  // Any number of validations can be added here
  async validateReferral(
    newUser: User,
    referringUser: User,
  ): Promise<ValidationResult> {
    const rateLimitCheck = await this.validateRateLimit(referringUser.id);
    if (!rateLimitCheck) {
      return {
        valid: false,
        error: ConvertReferralErrorCode.RATE_LIMIT_EXCEEDED,
      };
    }

    const phoneCheck = await this.validatePhoneNumberUsage(
      referringUser.phoneNumber,
      newUser.phoneNumber,
    );
    if (!phoneCheck) {
      return {
        valid: false,
        error: ConvertReferralErrorCode.SAME_PHONE_NUMBER_USED,
      };
    }

    return { valid: true, error: undefined };
  }

  async validateRateLimit(referringUserId: string): Promise<boolean> {
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000,
    ).toISOString();
    const recentReferrals = await this.referralRepository.findReferralsByUserId(
      referringUserId,
      {
        field: "convertedAt",
        order: "desc",
      },
    );

    const recentlyConverted = recentReferrals.filter((referral) => {
      if (!referral.convertedAt) return false;
      return new Date(referral.convertedAt) >= new Date(twentyFourHoursAgo);
    });

    return recentlyConverted.length < 10;
  }

  async validatePhoneNumberUsage(
    referrerPhone: string,
    newUserPhone: string,
  ): Promise<boolean> {
    return referrerPhone !== newUserPhone;
  }
}
