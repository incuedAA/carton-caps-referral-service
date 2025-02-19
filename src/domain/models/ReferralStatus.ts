/**
 * Represents a tracked referral between a referrer and a referree.
 * For the saek of simplicity we are only tracking converted "completed" referrals.
 * in the future, we could track failed referrals, or referrals that were not converted, and use this to flag fraudulent activity on user accounts.
 *
 */

export enum ReferralStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
