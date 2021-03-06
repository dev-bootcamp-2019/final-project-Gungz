import Submission from './Submission'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    Bounties: state.contracts.Bounties,
    accounts: state.accounts,
    accountBalances: state.accountBalances
  }
}

const SubmissionContainer = drizzleConnect(Submission, mapStateToProps);

export default SubmissionContainer;