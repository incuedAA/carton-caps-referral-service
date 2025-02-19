import { IUserService } from "../../../src/domain/services/UserService";
import { IReferralValidationService } from "../../../src/domain/services/ReferralValidationService";
import { IReferralRepository } from "../../../src/domain/repositories/ReferralRepository";
import { IDeepLinkService } from "../../../src/domain/services/DeepLinkService";
import {
  mockUsers,
  mockDeepLink,
  mockReferrals,
} from "../../../src/infrastructure/mocks/mockData";

/**
 * Creates a mock user service with default implementations
 */
export const createMockUserService = (): jest.Mocked<IUserService> => ({
  findByReferralCode: jest.fn(),
  getUserById: jest.fn(),
});

/**
 * Creates a mock validation service with default implementations
 */
export const createMockValidationService =
  (): jest.Mocked<IReferralValidationService> => ({
    validateReferral: jest.fn(),
  });

/**
 * Creates a mock referral repository with default implementations
 */
export const createMockReferralRepository =
  (): jest.Mocked<IReferralRepository> => ({
    findReferralsByUserId: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  });

/**
 * Creates a mock deep link service with default implementations
 */
export const createMockDeepLinkService = (): jest.Mocked<IDeepLinkService> => ({
  generateDeepLink: jest
    .fn()
    .mockImplementation((referralCode) =>
      mockDeepLink.generateUrl(referralCode),
    ),
});

/**
 * Common test data setup
 */
export const testData = {
  users: mockUsers,
  deepLink: mockDeepLink,
  referrals: mockReferrals,
  validReferralCode: "VALID123",
  invalidReferralCode: "INVALID123",
  userId: mockUsers[0].id,
};

/**
 * Creates a date that is a certain number of hours ago
 * @param hoursAgo Number of hours ago
 * @returns Date string in ISO format
 */
export const createDateHoursAgo = (hoursAgo: number): string => {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};
