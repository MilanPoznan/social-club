import { NearBindgen, near, call, view, UnorderedMap } from 'near-sdk-js';
import {
  ArtistDynamicProps,
  UserInterface,
  UserStatus,
  STORAGE_COST,
  SingleAritstType,
  ArtistModel
} from './models';
import { createDonationTransaction } from './utils/utils';
import { initUser, updateUserAfterDonation } from './utils/userUtils'
import { updateArtistAfterDonation } from './utils/artistUtils'



//Moram logiku za storage cost da odradim kada se registruju User & Artst
@NearBindgen({})
class Artist {
  allArtists: SingleAritstType = {}
  users: UserInterface[] = []
  contractDonations: bigint
  accountForProfit: 'maddev.testnet'

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

    const doesAccExist = this.allArtists[account_id]

    if (!doesAccExist) {


      const newArtist = new ArtistModel({
        account_id,
        title: title,
        about: about,
        categories: categories,
        socials: socials,
        subscription_types: subscription_types,
        onetime_donations: onetime_donations,
        image_url: image_url
      })


      this.allArtists[account_id] = newArtist

    } else {
      near.log('This account already exist ')
    }

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
    near.log(1, toTransfer)

    toTransfer -= STORAGE_COST
    near.log(2, toTransfer)


    //My 5% 
    let myMoney = toTransfer * BigInt(5000)
    let transferToArtist = toTransfer - myMoney
    near.log('myMoney- ', myMoney)
    near.log('transferToArtist- ', transferToArtist)

    near.log(transferToArtist)
    //Demo for now 
    const donationTransaction = createDonationTransaction(artist_id, donationAmount, true, '20-11-2022')

    near.log('Curr user Before donations', currentUser);
    near.log('Artist Before donations:', artistToDonate);

    if (currentUser) {
      updateUserAfterDonation(currentUser, donationTransaction, dontaionUsdt, toTransfer)
    } else {
      return `Please create account for ${donor} account`
    }

    updateArtistAfterDonation(artistToDonate, toTransfer, dontaionUsdt)

    //Send to artist
    const promise = near.promiseBatchCreate(artist_id)
    const transaction = near.promiseBatchActionTransfer(promise, toTransfer)


    //Send to me 
    // const myPromise = near.promiseBatchCreate(this.accountForProfit)
    // const myTransaction = near.promiseBatchActionTransfer(myPromise, myMoney)

    near.log('transaction ==== ', transaction)
    // near.log('Curr user After donations', currentUser)
    // near.log('myTransaction === :', myTransaction)

  }
}