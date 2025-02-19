import { IDeepLinkService } from "../domain/services/DeepLinkService";
import { IUserService } from "../domain/services/UserService";

export class CreateReferralLink {
  constructor(
    private deepLinkService: IDeepLinkService,
    private userService: IUserService,
  ) {
    this.deepLinkService = deepLinkService;
    this.userService = userService;
  }

  /**
   * Creates a new referral link for a user
   * @param referringUserId
   * @returns
   */
  async execute(referringUserId: string): Promise<{
    deepLink: string;
  }> {
    const user = await this.userService.getUserById(referringUserId);
    const referralCode = user.referralCode;
    const deepLink = await this.deepLinkService.generateDeepLink(referralCode);
    return {
      deepLink,
    };
  }
}
