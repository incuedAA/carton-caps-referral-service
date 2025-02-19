import { CreateReferralLink } from "../../../src/use-cases/CreateReferralLink";
import {
  createMockDeepLinkService,
  createMockUserService,
  testData,
} from "../utils/mocks";

describe("CreateReferralLink", () => {
  let createReferralLink: CreateReferralLink;
  let mockDeepLinkService: ReturnType<typeof createMockDeepLinkService>;
  let mockUserService: ReturnType<typeof createMockUserService>;

  const [mockUser] = testData.users;

  beforeEach(() => {
    mockDeepLinkService = createMockDeepLinkService();
    mockUserService = createMockUserService();

    createReferralLink = new CreateReferralLink(
      mockDeepLinkService,
      mockUserService,
    );
  });

  it("should create a referral link successfully", async () => {
    const userId = mockUser.id;
    const expectedDeepLink = testData.deepLink.generateUrl(
      mockUser.referralCode,
    );

    mockUserService.getUserById.mockResolvedValue(mockUser);
    mockDeepLinkService.generateDeepLink.mockResolvedValue(expectedDeepLink);

    const result = await createReferralLink.execute(userId);

    expect(result).toEqual({ deepLink: expectedDeepLink });
    expect(mockUserService.getUserById).toHaveBeenCalledWith(userId);
    expect(mockDeepLinkService.generateDeepLink).toHaveBeenCalledWith(
      mockUser.referralCode,
    );
  });

  it("should throw error when deep link service fails", async () => {
    const userId = mockUser.id;
    const error = new Error("Deep link service error");

    mockUserService.getUserById.mockResolvedValue(mockUser);
    mockDeepLinkService.generateDeepLink.mockRejectedValue(error);

    await expect(createReferralLink.execute(userId)).rejects.toThrow(error);
    expect(mockUserService.getUserById).toHaveBeenCalledWith(userId);
  });
});
