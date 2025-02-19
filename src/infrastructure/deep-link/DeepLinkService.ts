import { IDeepLinkService } from "../../domain/services/DeepLinkService";
import { mockDeepLink } from "../mocks/mockData";

/**
 * Service that mocks a third-party generator for deferred deep links
 *  Would normally use a real service like Firebase Dynamic Links or Branch.io
 */
export class DeepLinkService implements IDeepLinkService {
  async generateDeepLink(referralCode: string): Promise<string> {
    // Simulate generating a deferred deep link URL.
    // In production we would use a real service like Firebase Dynamic Links or Branch.io
    return mockDeepLink.generateUrl(referralCode);
  }
}
