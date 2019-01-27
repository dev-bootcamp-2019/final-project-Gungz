import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button} from 'reactstrap';

function RenderSubmission({jobStatus, submission, pendingSpinner, acceptSubmission}){
    if(pendingSpinner!==''){
        return(
            <Row>
                {pendingSpinner}
            </Row>
        )
    }

    return (
        <div>
            <Row>
                <Col xs="7" className="border border-dark">
                    {submission.description.split('\n').map((item, key) => {
                        return <span key={key}>{item}<br/></span>
                    })}
                </Col>
                <Col xs="4" className="border border-dark" style={{ 'wordWrap': 'break-word'}}>{submission.submissionPoster}</Col>
                <Col xs="1" className="border border-dark">{!jobStatus ? <Button type="button" onClick={()=>acceptSubmission(submission.submissionId)} className="btn btn-block btn-sm">Accept</Button> : ""}</Col>
            </Row>
        </div>
    );    
}

function RenderMySubmission({submission, pendingSpinner, withdrawPayment}){
    if(pendingSpinner!==''){
        return(
            <Row>
                {pendingSpinner}
            </Row>
        )
    }

    return (
        <div>
            <Row>
                <Col xs="8" className="border border-dark">
                    {submission.description.split('\n').map((item, key) => {
                        return <span key={key}>{item}<br/></span>
                    })}
                </Col>
                <Col xs="3" className="border border-dark" style={{ 'wordWrap': 'break-word'}}>{submission.chosen ? "Congratz, Your proposed solution is selected" : ""}</Col>
                <Col xs="1" className="border border-dark" style={{'paddingLeft': '5px'}}>{!submission.rewardTaken && submission.chosen ? <Button type="button" onClick={()=>withdrawPayment(submission.submissionId)} className="btn btn-sm">Withdraw</Button> : ""}</Col>
            </Row>
        </div>
    );    
}

class Submission extends Component{
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        var methodArgs = [props.index];
        if(props.jobId)
            methodArgs = [props.jobId, props.index];
        this.web3 = context.drizzle.web3;
        this.dataKey = this.contracts.Bounties.methods[props.method].cacheCall(...methodArgs);
        this.acceptSubmission = this.acceptSubmission.bind(this);
        this.withdrawPayment = this.withdrawPayment.bind(this);
    }

    acceptSubmission(submissionId){
        return this.contracts["Bounties"].methods["acceptSubmission"].cacheSend(submissionId);
    }

    withdrawPayment(submissionId){
        return this.contracts["Bounties"].methods["withdrawPayment"].cacheSend(submissionId);
    }

    render(){
        // Contract is not yet intialized.
        if(!this.props.Bounties.initialized) {
            return (
                <span>Initializing...</span>
            )
        }

        // If the data isn't here yet, show loading
        if(!(this.dataKey in this.props.Bounties[this.props.method])) {
            return (
                <span>Loading...</span>
            )
        }

        // If the data is here, get it and display it
        var data = this.props.Bounties[this.props.method][this.dataKey].value;

        var pendingSpinner = this.props.Bounties.synced ? '' : ' 🔄';
        
        if(this.props.jobId)
            return (
                <div>
                    <RenderSubmission jobStatus={this.props.jobStatus} submission={data} pendingSpinner={pendingSpinner} acceptSubmission={this.acceptSubmission} />        
                </div>
            );
        else
            return (
                <div>
                    <RenderMySubmission submission={data} pendingSpinner={pendingSpinner} withdrawPayment={this.withdrawPayment} />        
                </div>
            );
    }
}

Submission.contextTypes = {
    drizzle: PropTypes.object
}

export default Submission;