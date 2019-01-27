
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BountyContainer from './BountyContainer'

class Bounties extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    var methodArgs = [];
    this.dataKey = this.contracts.Bounties.methods[props.method + "Length"].cacheCall(...methodArgs);
  }
  render() {
     // Contract is not yet intialized.
     if(!this.props.Bounties.initialized) {
        return (
          <span>Initializing...</span>
        )
      }

    // If the data isn't here yet, show loading
    if(!(this.dataKey in this.props.Bounties[this.props.method + "Length"])) {
      return (
        <span>Loading...</span>
      )
    }

    // If the data is here, get it and display it
    var data = this.props.Bounties[this.props.method + "Length"][this.dataKey].value;
    var pendingSpinner = this.props.Bounties.synced ? '' : ' 🔄';

    //console.log([...Array(data).keys()]);
    //console.log(typeof data);
    const bounties = [...Array(Number(data)).keys()].map((number)=>{
        //console.log("number: " + number);
        return(
            <BountyContainer key={number} index={number} method={this.props.method} allBounties={this.props.allBounties} />
        );
    });
    
    return (
      <div>
        {bounties}{pendingSpinner}
      </div>
    )
  }
}

Bounties.contextTypes = {
  drizzle: PropTypes.object
}

export default Bounties;
