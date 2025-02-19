import { User } from "../../domain/models/User";
import { IUserService } from "../../domain/services/UserService";
import { mockUsers } from "../mocks/mockData";

/**
 * Service that mocks the existing user API already used by the application
 */
export class UserApiService implements IUserService {
  private users = mockUsers;

  async getUserById(userId: string): Promise<User> {
    // Simulate an API call to fetch user details
    const user = this.users.find((user) => user.id === userId);
    return user || this.users[0]; // Fallback to first user if not found
  }

  async findByReferralCode(referralCode: string): Promise<User> {
    // Simulate an API call to fetch user details
    const user = this.users.find((user) => user.referralCode === referralCode);
    return user || this.users[0]; // Fallback to first user if not found
  }
}
