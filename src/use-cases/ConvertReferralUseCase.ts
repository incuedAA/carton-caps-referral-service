import { IReferralRepository } from "../domain/repositories/ReferralRepository";
import { ConvertReferralResponse } from "../api/dtos/referral.dto";
import { IReferralValidationService } from "../domain/services/ReferralValidationService";
import { IUserService } from "../domain/services/UserService";
import { User } from "../domain/models/User";
import { randomUUID } from "crypto";
import { Referral } from "../domain/models/Referral";
import { ConvertReferralErrorCode } from "../domain/models/ConvertReferralErrorCode";
import { ReferralStatus } from "../domain/models/ReferralStatus";

export class ConvertReferralUseCase {
  constructor(
    private userService: IUserService,
    private validationService: IReferralValidationService,
    private referralRepository: IReferralRepository,
  ) {}

  async execute(
    referralCode: string,
    newUser: User,
  ): Promise<ConvertReferralResponse> {
    //1. get user by referral code
    const referringUser =
      await this.userService.findByReferralCode(referralCode);
    // Run all validations
    const validationResult = await this.validationService.validateReferral(
      newUser,
      referringUser,
    );
    // 2. if validations fail, return error
    if (!validationResult.valid) {
      return {
        converted: false,
        code: validationResult?.error ?? ConvertReferralErrorCode.UNKNOWN_ERROR,
      };
    }
    // 3. if validations pass, create referral
    else {
      const newReferral: Referral = {
        id: randomUUID(),
        referringUserId: referringUser.id,
        convertedUser: newUser,
        convertedAt: new Date().toISOString(),
        status: ReferralStatus.COMPLETED,
      };
      const referral = await this.referralRepository.create(newReferral);
      return {
        converted: true,
        referral: referral,
      };
    }
  }
}
