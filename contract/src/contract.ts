import { NearBindgen, near, call, view, UnorderedMap } from 'near-sdk-js';
import { ArtistDynamicProps, UserInterface, UserStatus, STORAGE_COST, UserSubscription } from './models';
import { initUser, createDonationTransaction } from './utils';



//Moram logiku za storage cost da odradim kada se registruju User & Artst
@NearBindgen({})
class Artist {
  allArtists = {}
  users: UserInterface[] = []

  @view({})
  get_artist({ account_id }) {
    return this.allArtists[account_id]
  }

  @view({})
  get_all_artist() {
    return this.allArtists
  }

  @view({})
  get_all_users() {
    return this.users
  }

  @view({})
  get_user({ account_id }) {
    return this.users.filter(user => user.account_id === account_id)
  }

  @call({})
  create_user_profile({ status }: { status: UserStatus }): UserInterface | "User already exist" {

    let userAccountId = near.predecessorAccountId()

    const checkDoesUserExist = this.users.filter(item => item.account_id === userAccountId)

    if (checkDoesUserExist.length === 0) {
      let newUser = initUser(userAccountId, status)
      this.users.push(newUser)
    } else {
      near.log('User already exist')
      return "User already exist"
    }
  }

  @call({})
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

  @call({ payableFunction: true })
  donate_to_artist({ artist_id, dontaionUsdt }: { artist_id: string, dontaionUsdt: number }) {

    //User 
    const donor = near.predecessorAccountId();
    const filterCurrentUser = this.users.filter(user => user.account_id === donor)
    const currentUser = filterCurrentUser[0]
    const donationAmount: bigint = near.attachedDeposit() as bigint;

    //Artist
    const artistToDonate = this.allArtists[artist_id]

    let toTransfer = donationAmount;
    near.log('toTransfer', toTransfer)
    toTransfer -= STORAGE_COST

    //Demo for now 
    const donationTransaction = createDonationTransaction(artist_id, donationAmount, true, '20-11-2022')

    near.log('Curr user Before donations', currentUser);
    near.log('Artist Before donations:', artistToDonate);

    if (currentUser) {
      currentUser.total_transactions += 1;
      currentUser.total_dontaions += toTransfer;
      (currentUser.subscription_lists as UserSubscription[]).push(donationTransaction);
      currentUser.total_dontaions_usdt += dontaionUsdt
    } else {
      return `Please create account for ${donor} account`
    }

    let artistPreviousDonations: bigint = BigInt(artistToDonate.total_donations_near)
    let subtractDonations = artistPreviousDonations + toTransfer

    //Artist
    artistToDonate.total_donations_near = subtractDonations.toString()
    artistToDonate.total_donations_count += 1
    artistToDonate.total_donations_usd = artistToDonate.total_donations_usd + dontaionUsdt

    const promise = near.promiseBatchCreate(artist_id)
    near.promiseBatchActionTransfer(promise, toTransfer)

    near.log('Curr user After donations', currentUser)
    near.log('Artist After donations:', artistToDonate)


  }
}