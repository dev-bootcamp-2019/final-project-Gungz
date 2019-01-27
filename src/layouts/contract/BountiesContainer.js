import Bounties from './Bounties'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    Bounties: state.contracts.Bounties
  }
}

const BountiesContainer = drizzleConnect(Bounties, mapStateToProps);

export default BountiesContainer;