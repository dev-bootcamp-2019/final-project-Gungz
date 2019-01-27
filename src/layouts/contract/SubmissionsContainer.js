import Submissions from './Submissions'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    Bounties: state.contracts.Bounties
  }
}

const SubmissionsContainer = drizzleConnect(Submissions, mapStateToProps);

export default SubmissionsContainer;