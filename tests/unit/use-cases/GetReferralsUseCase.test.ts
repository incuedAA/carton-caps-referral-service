import { GetReferralsUseCase } from "../../../src/use-cases/GetReferralsUseCase";
import { createMockReferralRepository, testData } from "../utils/mocks";

describe("GetReferralsUseCase", () => {
  let getReferralsUseCase: GetReferralsUseCase;
  let mockReferralRepository: ReturnType<typeof createMockReferralRepository>;

  beforeEach(() => {
    mockReferralRepository = createMockReferralRepository();
    getReferralsUseCase = new GetReferralsUseCase(mockReferralRepository);
  });

  it("should return correct referrals for a given user ID", async () => {
    mockReferralRepository.findReferralsByUserId.mockResolvedValue(
      testData.referrals,
    );

    const result = await getReferralsUseCase.execute(testData.userId);

    expect(result).toEqual(testData.referrals);
    expect(mockReferralRepository.findReferralsByUserId).toHaveBeenCalledWith(
      testData.userId,
    );
  });

  it("should return empty array when user has no referrals", async () => {
    mockReferralRepository.findReferralsByUserId.mockResolvedValue([]);

    const result = await getReferralsUseCase.execute("user-without-referrals");

    expect(result).toEqual([]);
    expect(mockReferralRepository.findReferralsByUserId).toHaveBeenCalledWith(
      "user-without-referrals",
    );
  });
});
