import { ArtistModel } from '../models'

export function updateArtistAfterDonation(artistToDonate: ArtistModel, toTransfer: bigint, dontaionUsdt: number) {

  let artistPreviousDonations: bigint = BigInt(artistToDonate.total_donations_near)
  let calcTotalDonations = artistPreviousDonations + toTransfer

  //Artist
  artistToDonate.total_donations_near = calcTotalDonations.toString()
  artistToDonate.total_donations_count += 1
  artistToDonate.total_donations_usd = artistToDonate.total_donations_usd + dontaionUsdt

}