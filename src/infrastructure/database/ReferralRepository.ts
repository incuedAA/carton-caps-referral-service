import { Referral } from "../../domain/models/Referral";
import { IReferralRepository } from "../../domain/repositories/ReferralRepository";
import { mockReferrals } from "../mocks/mockData";

export class ReferralRepository implements IReferralRepository {
  private referrals: Referral[] = [...mockReferrals];

  async findAll(): Promise<Referral[]> {
    return this.referrals;
  }

  async findById(id: string): Promise<Referral | null> {
    const referral = this.referrals.find((r) => r.id === id);
    return referral || null;
  }

  async create(referral: Referral): Promise<Referral> {
    this.referrals.push(referral);
    return referral;
  }

  async findReferralsByUserId(
    userId: string,
    sort?: {
      field: keyof Referral;
      order: "asc" | "desc";
    },
  ): Promise<Referral[]> {
    const results = this.referrals.filter((r) => r.referringUserId === userId);

    if (sort) {
      results.sort((a, b) => {
        const aValue = a[sort.field];
        const bValue = b[sort.field];

        if (aValue === undefined || bValue === undefined) return 0;

        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sort.order === "asc" ? comparison : -comparison;
      });
    }

    return results;
  }
}
