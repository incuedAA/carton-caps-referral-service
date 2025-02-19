export interface IDeepLinkService {
  /**
   * Generates a deferred deep link from a referral code
   * @param referralCode - The referral code to generate a deep link for
   * @returns A promise that resolves to the deep link URL
   */
  generateDeepLink(referralCode: string): Promise<string>;
}
