import { ConvertReferralUseCase } from "../../../src/use-cases/ConvertReferralUseCase";
import { ConvertReferralErrorCode } from "../../../src/domain/models/ConvertReferralErrorCode";
import { Referral } from "../../../src/domain/models/Referral";
import { ReferralStatus } from "../../../src/domain/models/ReferralStatus";
import {
  createMockUserService,
  createMockValidationService,
  createMockReferralRepository,
  testData,
} from "../utils/mocks";

// we need to mock the crypto module to return a fixed UUID for the test
jest.mock("crypto", () => ({
  randomUUID: () => "test-uuid",
}));

describe("ConvertReferralUseCase", () => {
  let convertReferralUseCase: ConvertReferralUseCase;
  let mockUserService: ReturnType<typeof createMockUserService>;
  let mockValidationService: ReturnType<typeof createMockValidationService>;
  let mockReferralRepository: ReturnType<typeof createMockReferralRepository>;

  const [, mockReferringUser, mockNewUser] = testData.users;

  beforeEach(() => {
    mockUserService = createMockUserService();
    mockValidationService = createMockValidationService();
    mockReferralRepository = createMockReferralRepository();

    convertReferralUseCase = new ConvertReferralUseCase(
      mockUserService,
      mockValidationService,
      mockReferralRepository,
    );
  });

  it("should successfully convert a referral when all validations pass", async () => {
    const expectedReferral: Referral = {
      id: "test-uuid",
      referringUserId: mockReferringUser.id,
      status: ReferralStatus.COMPLETED,
      convertedUser: mockNewUser,
      convertedAt: expect.any(String),
    };

    mockUserService.findByReferralCode.mockResolvedValue(mockReferringUser);
    mockValidationService.validateReferral.mockResolvedValue({ valid: true });
    mockReferralRepository.create.mockResolvedValue(expectedReferral);

    const result = await convertReferralUseCase.execute(
      testData.validReferralCode,
      mockNewUser,
    );

    expect(result).toEqual({
      converted: true,
      referral: expectedReferral,
    });
    expect(mockUserService.findByReferralCode).toHaveBeenCalledWith(
      testData.validReferralCode,
    );
    expect(mockValidationService.validateReferral).toHaveBeenCalledWith(
      mockNewUser,
      mockReferringUser,
    );
    expect(mockReferralRepository.create).toHaveBeenCalledWith(
      expectedReferral,
    );
  });

  it("should return error when referral validation fails", async () => {
    const errorCode = ConvertReferralErrorCode.REFERRAL_NOT_FOUND;

    mockUserService.findByReferralCode.mockResolvedValue(mockReferringUser);
    mockValidationService.validateReferral.mockResolvedValue({
      valid: false,
      error: errorCode,
    });

    const result = await convertReferralUseCase.execute(
      testData.invalidReferralCode,
      mockNewUser,
    );

    expect(result).toEqual({
      converted: false,
      code: errorCode,
    });
    expect(mockReferralRepository.create).not.toHaveBeenCalled();
  });
});
