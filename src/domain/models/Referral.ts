import { ReferralStatus } from "./ReferralStatus";
import { User } from "./User";

export interface Referral {
  id: string;
  /**
   * The user id of the referrer
   */
  referringUserId: string;
  /**
   * The date and time the referral was converted
   */
  convertedAt?: string;
  /**
   * The user who was converted,
   */
  status: ReferralStatus;
  /**
   * The user who was converted,
   */
  convertedUser: User;
}
