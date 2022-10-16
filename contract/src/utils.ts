import { UserSubscription, ArtistDynamicProps, UserInterface, UserStatus } from './models';

export function initUser(account_id: string, status: UserStatus): UserInterface {
  return {
    account_id: account_id,
    total_dontaions: '0',
    total_dontaions_usdt: 0,
    total_transactions: 0,
    subscription_lists: [],
    user_status: status

  }
}

export function createDonationTransaction(artistId: string, donationAmount: bigint, isOneTimeDonation: boolean, timestamp: string): UserSubscription {
  return {
    account_to_subscribe: artistId,
    subscription_type: donationAmount.toString(),
    is_onetime_donation: isOneTimeDonation,
    timestamp: timestamp
  }
}