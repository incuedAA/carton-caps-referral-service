import { ReferralValidationService } from "../../../src/infrastructure/validation/ReferralValidationService";
import { ConvertReferralErrorCode } from "../../../src/domain/models/ConvertReferralErrorCode";
import { Referral } from "../../../src/domain/models/Referral";
import {
  createMockReferralRepository,
  testData,
  createDateHoursAgo,
} from "../utils/mocks";

describe("ReferralValidationService", () => {
  let validationService: ReferralValidationService;
  let mockReferralRepository: ReturnType<typeof createMockReferralRepository>;

  const [, mockReferringUser, mockNewUser] = testData.users;

  beforeEach(() => {
    mockReferralRepository = createMockReferralRepository();
    validationService = new ReferralValidationService(mockReferralRepository);
  });

  describe("validateReferral", () => {
    it("should return valid when all validations pass", async () => {
      mockReferralRepository.findReferralsByUserId.mockResolvedValue([]);

      const result = await validationService.validateReferral(
        mockNewUser,
        mockReferringUser,
      );

      expect(result).toEqual({ valid: true, error: undefined });
    });

    it("should return rate limit error when too many referrals", async () => {
      const recentReferrals: Partial<Referral>[] = Array(10).fill({
        convertedAt: createDateHoursAgo(1),
      });

      mockReferralRepository.findReferralsByUserId.mockResolvedValue(
        recentReferrals as Referral[],
      );

      const result = await validationService.validateReferral(
        mockNewUser,
        mockReferringUser,
      );

      expect(result).toEqual({
        valid: false,
        error: ConvertReferralErrorCode.RATE_LIMIT_EXCEEDED,
      });
    });

    it("should return phone number error when same phone number is used", async () => {
      mockReferralRepository.findReferralsByUserId.mockResolvedValue([]);

      const newUserWithSamePhone = {
        ...mockNewUser,
        phoneNumber: mockReferringUser.phoneNumber,
      };

      const result = await validationService.validateReferral(
        newUserWithSamePhone,
        mockReferringUser,
      );

      expect(result).toEqual({
        valid: false,
        error: ConvertReferralErrorCode.SAME_PHONE_NUMBER_USED,
      });
    });
  });

  describe("validateRateLimit", () => {
    it("should return okay when user has no referrals", async () => {
      mockReferralRepository.findReferralsByUserId.mockResolvedValue([]);

      const result = await validationService.validateRateLimit(
        mockReferringUser.id,
      );

      expect(result).toBe(true);
      expect(mockReferralRepository.findReferralsByUserId).toHaveBeenCalledWith(
        mockReferringUser.id,
        { field: "convertedAt", order: "desc" },
      );
    });

    it("should return okay when user has less than 10 referrals in 24 hours", async () => {
      const recentReferrals: Partial<Referral>[] = Array(5).fill({
        convertedAt: createDateHoursAgo(1),
      });

      mockReferralRepository.findReferralsByUserId.mockResolvedValue(
        recentReferrals as Referral[],
      );

      const result = await validationService.validateRateLimit(
        mockReferringUser.id,
      );

      expect(result).toBe(true);
    });

    it("should return invalid when user has 10 or more referrals in 24 hours", async () => {
      const recentReferrals: Partial<Referral>[] = Array(10).fill({
        convertedAt: createDateHoursAgo(1),
      });

      mockReferralRepository.findReferralsByUserId.mockResolvedValue(
        recentReferrals as Referral[],
      );

      const result = await validationService.validateRateLimit(
        mockReferringUser.id,
      );

      expect(result).toBe(false);
    });

    it("should only count referrals within the last 24 hours", async () => {
      const recentReferrals: Partial<Referral>[] = [
        { convertedAt: createDateHoursAgo(1) },
        { convertedAt: createDateHoursAgo(25) }, // Should not be counted
      ];

      mockReferralRepository.findReferralsByUserId.mockResolvedValue(
        recentReferrals as Referral[],
      );

      const result = await validationService.validateRateLimit(
        mockReferringUser.id,
      );

      expect(result).toBe(true);
    });
  });

  describe("validatePhoneNumberUsage", () => {
    it("should return true when phone numbers are different", async () => {
      const result = await validationService.validatePhoneNumberUsage(
        "+1234567890",
        "+9876543210",
      );

      expect(result).toBe(true);
    });

    it("should return false when phone numbers are the same", async () => {
      const phoneNumber = "+1234567890";
      const result = await validationService.validatePhoneNumberUsage(
        phoneNumber,
        phoneNumber,
      );

      expect(result).toBe(false);
    });

    it("should handle empty phone numbers", async () => {
      const result = await validationService.validatePhoneNumberUsage("", "");

      expect(result).toBe(false);
    });
  });
});
