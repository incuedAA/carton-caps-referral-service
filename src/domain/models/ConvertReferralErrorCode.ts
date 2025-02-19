export enum ConvertReferralErrorCode {
  // If the referral code is not found
  REFERRAL_NOT_FOUND = "REFERRAL_NOT_FOUND",
  // If the referrer is using the same device as the referree
  SIMILAR_DEVICE_USED = "SIMILAR_DEVICE_USED",
  // If the referrer is using the phone number as the referree (assuming users can have the same phone number across different devices)
  SAME_PHONE_NUMBER_USED = "SAME_PHONE_NUMBER_USED",
  // If the user has over 10 referrals in the last 24 hours, they can't convert more referrals until the next day
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  // any other error that doesn't fall into the above categories (testing)
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
