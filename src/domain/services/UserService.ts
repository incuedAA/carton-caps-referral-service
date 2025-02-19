import { User } from "../models/User";

export interface IUserService {
  getUserById(userId: string): Promise<User>;
  findByReferralCode(referralCode: string): Promise<User>;
}
