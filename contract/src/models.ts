// 'use strict';
type SubscriptionType = 1 | 3 | 5 | 10 | 25 | 50 | 100 | 250 | 500

export const STORAGE_COST: bigint = BigInt("1000000000000000000000")

export type UserStatus = 'bronze' | 'silver' | 'gold' | 'diamon'

export interface UserSubscription {
  account_to_subscribe: string //Artist account 
  subscription_type: string // Chose between artist options 1,3,5,10,50... 
  is_onetime_donation: boolean //
  timestamp: string
}

export interface UserInterface {
  account_id: string
  total_dontaions: string //Donations value
  total_dontaions_usdt: number //Donations value
  total_transactions: number //count number of donations
  subscription_lists: UserSubscription[] | []
  user_status: UserStatus //Default is bronze 
}


export interface ArtistDynamicProps {
  title: string;
  about: string | null;
  categories: string[];
  socials: string[] | null;
  subscription_types: SubscriptionType[];
  onetime_donations: boolean;
  image_url: null | string;
}

interface ArtistDynamicPropsWithID extends ArtistDynamicProps {
  account_id: string
}

export interface SingleAritstType {
  [key: string]: ArtistModel
}

export class ArtistModel {
  account_id: string; //wallet id
  title: string;
  about: string | null;
  categories: string[];
  socials: string[] | null;
  subscription_types: SubscriptionType[];
  onetime_donations: boolean;
  image_url: null | string;
  total_donations_near: string;
  total_donations_usd: number;
  total_donations_count: number;

  constructor({ account_id, title, about, categories, socials, subscription_types, onetime_donations, image_url }: ArtistDynamicPropsWithID) {
    this.account_id = account_id
    this.title = title
    this.about = about
    this.categories = categories
    this.socials = socials
    this.subscription_types = subscription_types
    this.onetime_donations = onetime_donations
    this.image_url = image_url
    this.total_donations_near = '0'
    this.total_donations_usd = 0
    this.total_donations_count = 0
  }


}