type SubscriptionType = 1 | 3 | 5 | 10 | 25 | 50 | 100 | 250 | 500


export interface ArtistDynamicProps {
  title: string;
  about: string | null;
  categories: string[];
  socials: string[] | null;
  subscription_types: SubscriptionType[];
  onetime_donations: boolean;
  image_url: null | string;
}

export class Artist {
  account_id: string; //wallet id
  title: string;
  about: string | null;
  categories: string[];
  socials: string[] | null;
  subscription_types: string[];
  onetime_donations: boolean;
  image_url: null | string;
  total_donations_near: string;
  total_donations_usd: number;
  total_donations_count: number;

  constructor({ account_id, title, about, categories, socials, subscription_types, onetime_donations = true, image_url = null }) {
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