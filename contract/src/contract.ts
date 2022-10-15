import { NearBindgen, near, call, view, UnorderedMap } from 'near-sdk-js';
import { ArtistDynamicProps, UserInterface, UserStatus } from './models';
import { initUser } from './utils';


@NearBindgen({})
class Artist {
  allArtists = {}
  // users: UserInterface[] = []

  @view({})
  get_artist({ account_id }) {
    return this.allArtists[account_id]
  }

  @view({})
  get_all_artist() {
    return this.allArtists
  }

  @view({})
  // get_all_users() {
  //   return this.users
  // }

  // @view({})
  // get_user({ account_id }) {
  //   return this.users.filter(user => user.account_id === account_id)
  // }

  // @call({})
  // create_user_profile({ status }: { status: UserStatus }): UserInterface | "User already exist" {

  //   let userAccountId = near.predecessorAccountId()

  //   const checkDoesUserExist = this.users.filter(item => item.account_id === userAccountId)

  //   if (checkDoesUserExist.length === 0) {
  //     return initUser(userAccountId, status)
  //   } else {
  //     near.log('User already exist')
  //     return "User already exist"
  //   }
  // }

  @call({}) // This method changes the state, for which it cost gas
  create_artist({ title, about, categories, socials, subscription_types, onetime_donations, image_url }: ArtistDynamicProps): void {


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
      // return "This account already exist";

    }

    near.log(this.allArtists)

  }
}