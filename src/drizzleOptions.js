import Bounties from './../build/contracts/Bounties.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [
    Bounties
  ],
  events: {
    Bounties: ['jobCreated', 'submissionCreated', 'Received', 'paymentWithdrawn', 'submissionAccepted']
  },
  polls: {
    accounts: 1500
  }
}

export default drizzleOptions