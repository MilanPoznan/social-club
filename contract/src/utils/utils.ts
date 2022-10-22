import { UserSubscription } from '../models';



export function createDonationTransaction(artistId: string, donationAmount: bigint, isOneTimeDonation: boolean, timestamp: string): UserSubscription {
  return {
    account_to_subscribe: artistId,
    subscription_type: donationAmount.toString(),
    is_onetime_donation: isOneTimeDonation,
    timestamp: timestamp
  }
}