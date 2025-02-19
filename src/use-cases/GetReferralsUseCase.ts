import { Referral } from "../domain/models/Referral";
import { IReferralRepository } from "../domain/repositories/ReferralRepository";

export class GetReferralsUseCase {
  constructor(private referralRepository: IReferralRepository) {}

  async execute(referringUserId: string): Promise<Referral[]> {
    return await this.referralRepository.findReferralsByUserId(referringUserId);
  }
}
