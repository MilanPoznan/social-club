import { NearBindgen, near, call, view, UnorderedMap } from 'near-sdk-js';
import { ArtistDynamicProps } from './models';

@NearBindgen({})
class Artist {
  allArtists = {}

  @view({}) // This method is read-only and can be called for free
  get_artist({ account_id }) {
    return this.allArtists[account_id]
  }

  @view({})
  get_all_artist() {
    return this.allArtists
  }

  @call({}) // This method changes the state, for which it cost gas
  create_artist({ title, about, categories, socials, subscription_types, onetime_donations, image_url }: ArtistDynamicProps): void {

    near.log('this - before', this)

    let account_id = near.predecessorAccountId()

    near.log('ALL- ', this.allArtists)
    const doesAccExist = this.allArtists[account_id]
    near.log('doesAccExist', doesAccExist)

    if (!doesAccExist) {

      const newArtist = {
        account_id: account_id,
        title: title,
        about: about,
        categories: categories,
        socials: socials,
        subscription_types: subscription_types,
        onetime_donations: onetime_donations,
        image_url: image_url,
        total_donations_near: '0',
        total_donations_usd: 0,
        total_donations_count: 0
      }

      this.allArtists[account_id] = newArtist

    } else {

      near.log('This account already exist ')

    }

    near.log(this.allArtists)

  }
}