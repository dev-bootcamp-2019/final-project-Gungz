
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SubmissionContainer from './SubmissionContainer'
import SubmissionHeader from './SubmissionHeader'

class Submissions extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    var methodArgs = [];
    //alert(props.jobId);
    if(props.jobId){
        methodArgs = [props.jobId];
    }
    this.dataKey = this.contracts.Bounties.methods[props.method + "Length"].cacheCall(...methodArgs);
  }
  
  render() {    
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
    
    const submissions = [...Array(Number(data)).keys()].map((number)=>{
        //console.log("number: " + number);
        return(
            <SubmissionContainer key={number} jobStatus={this.props.jobStatus} jobId={this.props.jobId} index={number} method={this.props.method} />
        );
    });
    
    return (
        <div style={{'padding': '1%'}}>
            <SubmissionHeader jobId={this.props.jobId} />
            {submissions}{pendingSpinner}
        </div>
    );
  }
}

Submissions.contextTypes = {
  drizzle: PropTypes.object
}

export default Submissions;
