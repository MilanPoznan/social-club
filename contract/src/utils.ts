import { ArtistDynamicProps, UserInterface, UserStatus } from './models';

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