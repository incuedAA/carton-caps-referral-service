import { User } from "../../domain/models/User";
import { Referral } from "../../domain/models/Referral";
import { ReferralStatus } from "../../domain/models/ReferralStatus";

// Mock User Data for testing purposes
export const mockUsers: User[] = [
  {
    id: "default-user-id",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    dob: "1990-01-01",
    phoneNumber: "+1234567890",
    createdAt: new Date(),
    updatedAt: new Date(),
    referralCode: "MOCK123",
  },
  {
    id: "referring-user-id",
    email: "referrer@example.com",
    firstName: "John",
    lastName: "Referrer",
    phoneNumber: "+1234567890",
    dob: "1990-01-01",
    createdAt: new Date(),
    updatedAt: new Date(),
    referralCode: "REF123",
  },
  {
    id: "new-user-id",
    email: "newuser@example.com",
    firstName: "John",
    lastName: "NewUser",
    phoneNumber: "+9876543210",
    dob: "1995-01-01",
    createdAt: new Date(),
    updatedAt: new Date(),
    referralCode: "NEW123",
  },
];

// Mock Referral Data
export const mockReferrals: Referral[] = [
  {
    id: "ref-1",
    referringUserId: "1",
    convertedAt: "2024-01-01",
    status: ReferralStatus.COMPLETED,
    convertedUser: {
      id: "2",
      email: "jane@test.com",
      firstName: "Jane",
      lastName: "Doe",
      dob: "1990-01-01",
      phoneNumber: "+1234567890",
      createdAt: new Date(),
      updatedAt: new Date(),
      referralCode: "MOCK123",
    },
  },
];

// Mock Deep Link Data
export const mockDeepLink = {
  baseUrl: "https://mockdeeplink.com",
  generateUrl: (referralCode: string) =>
    `${mockDeepLink.baseUrl}/?referral=${referralCode}`,
};
