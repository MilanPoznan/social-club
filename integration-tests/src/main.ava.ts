import { Worker, NearAccount, NEAR } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';
import { Artist } from './testModels'
const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount('test-account');
  // Get wasm file path from package.json test script in folder above
  await contract.deploy(
    process.argv[2],
  );


  const rambo = await root.createSubAccount('rambo')
  const prtibege = await root.createSubAccount('prtibege')
  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  /**
   * Acc poseduje kontract 
   * acc posedije ramba kao subaccount
   */
  t.context.accounts = { root, contract, rambo, prtibege };// contract 

});

test.afterEach.always(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

// test('SHould Set new artist', async (t) => {

//   const { contract, rambo } = t.context.accounts;

//   const newArtist = {
//     title: 'Rambo Amadeus',
//     about: 'Rambo je car',
//     categories: ['music', 'art'],
//     socials: null,
//     subscription_types: [1, 5, 10],
//     onetime_donations: true,
//     image_url: null,

//   }

//   await rambo.call(contract, 'create_artist', { ...newArtist })

//   const result = await contract.view('get_artist', { account_id: rambo.accountId })

//   console.log('final', result)

//   t.deepEqual(result, {
//     account_id: rambo.accountId,
//     title: 'Rambo Amadeus',
//     about: 'Rambo je car',
//     categories: ['music', 'art'],
//     socials: null,
//     subscription_types: [1, 5, 10],
//     onetime_donations: true,
//     image_url: null,
//     total_donations_near: '0',
//     total_donations_usd: 0,
//     total_donations_count: 0
//   })
// });


test('Get all artists', async (t) => {

  const { contract, rambo, prtibege } = t.context.accounts;

  const firstArtist = {
    title: 'Rambo Amadeus',
    about: 'Rambo je car',
    categories: ['music', 'art'],
    socials: null,
    subscription_types: [1, 5, 10],
    onetime_donations: true,
    image_url: null,
  }

  const secondArtist = {
    title: 'Prti Bee GEe',
    about: 'Cigani na Adi',
    categories: ['music', 'art'],
    socials: null,
    subscription_types: [5, 10, 25, 100],
    onetime_donations: true,
    image_url: null,
  }

  await rambo.call(contract, 'create_artist', { ...firstArtist })

  await prtibege.call(contract, 'create_artist', { ...secondArtist })

  const allArtists = await contract.view('get_all_artist')

  console.log('all artists', allArtists)


})

