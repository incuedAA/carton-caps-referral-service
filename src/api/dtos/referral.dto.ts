import {
  IsDate,
  IsDefined,
  IsEmail,
  IsObject,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Referral } from "../../domain/models/Referral";
import { Type } from "class-transformer";
import { User } from "../../domain/models/User";
import { ConvertReferralErrorCode } from "../../domain/models/ConvertReferralErrorCode";

export class CreateReferralDeepLinkRequest {
  // Empty request body
}

export class CreateReferralDeepLinkResponse {
  deepLink: string;
}

class ConvertReferralUser implements User {
  @IsString()
  @MinLength(1)
  id: string;

  @IsEmail()
  @MinLength(1)
  email: string;

  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsString()
  @MinLength(1)
  phoneNumber: string;

  @IsString()
  @MinLength(1)
  dob: string;

  @IsString()
  @MinLength(1)
  referralCode: string;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

export class ConvertReferralRequest {
  @IsString()
  @MinLength(1, { message: "referralCode is required" })
  referralCode: string;

  @IsObject()
  @IsDefined()
  @ValidateNested()
  @Type(() => ConvertReferralUser)
  newUser: ConvertReferralUser;
}
// DTO to get referrals
export class GetReferralsRequest {
  @IsString()
  @MinLength(1, { message: "referringUserId is required" })
  referringUserId: string;
}
export class GetReferralsResponse {
  referrals: Referral[];
}

export class ConvertReferralsSuccessResponse {
  converted: boolean;
  referral: Referral;
}

export class ConvertReferralErrorResponse {
  converted: boolean;
  code: ConvertReferralErrorCode;
}

export type ConvertReferralResponse =
  | ConvertReferralsSuccessResponse
  | ConvertReferralErrorResponse;
