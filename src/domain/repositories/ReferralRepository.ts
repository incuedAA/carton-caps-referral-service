import { Referral } from "../models/Referral";

/**
 * Interface for the referral repository
 * for the sake of this exercise, we'll only include the methods that are needed
 * @interface IReferralRepository
 */
export interface IReferralRepository {
  findReferralsByUserId(
    referringUserId: string,
    sort?: {
      field: keyof Referral;
      order: "asc" | "desc";
    },
  ): Promise<Referral[]>;
  findById(id: string): Promise<Referral | null>;
  create(referral: Referral): Promise<Referral>;
}
