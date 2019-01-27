import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Collapse, Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import SubmissionsContainer from './SubmissionsContainer';
import SubmissionForm from './SubmissionForm';


function RenderBounty({allBounties, bounty, pendingSpinner, toggleCollapse, isCollapse, accounts, toggleSubmission}){
    if(pendingSpinner!==''){
        return(
            <Row>
                {pendingSpinner}
            </Row>
        )
    }

    if(allBounties){
        /*const action = <span></span>;
        if(bounty.jobPoster !== accounts[0]){
            action = <Button>Submit Proposal</Button>;
        }*/
        return (
            <div>
                <Row>
                    <Col xs="3" className="border border-dark">{bounty.name}</Col>
                    <Col xs="4" className="border border-dark">
                    {bounty.description.split('\n').map((item, key) => {
                        return <span key={key}>{item}<br/></span>
                    })}
                    </Col>
                    <Col xs="2" className="border border-dark">{bounty.reward}</Col>
                    <Col xs="2" className="border border-dark">{bounty.finished ? "Completed" : "Not Completed"}</Col>
                    <Col xs="1" className="border border-dark" style={{'paddingLeft': '1%'}}>{bounty.jobPoster !== accounts[0] && !bounty.finished ? <Button type="button" onClick={()=>toggleSubmission(bounty.id)} className="btn btn-sm">Propose</Button> : ""}</Col>
                </Row>
            </div>
        );
    }   
    else
        return (
            <div>
                <Row className="bountyRow" onClick={toggleCollapse}>
                    <Col xs="3" className="border border-dark">{bounty.name}</Col>
                    <Col xs="5" className="border border-dark">
                    {bounty.description.split('\n').map((item, key) => {
                        return <span key={key}>{item}<br/></span>
                    })}
                    </Col>
                    <Col xs="2" className="border border-dark">{bounty.reward}</Col>
                    <Col xs="2" className="border border-dark">{bounty.finished ? "Completed" : "Not Completed"}</Col>
                </Row>
                <Collapse isOpen={isCollapse}>
                    <SubmissionsContainer method="getSubmissionByJobID" jobId={bounty.id} jobStatus={bounty.finished} isOpen={isCollapse} />
                </Collapse>
            </div>
        );
    
}

class Bounty extends Component{
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        var methodArgs = [this.props.index];
        this.web3 = context.drizzle.web3;
        this.dataKey = this.contracts.Bounties.methods[props.method].cacheCall(...methodArgs);

        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.toggleSubmission = this.toggleSubmission.bind(this);

        this.state = {
            collapse: false,
            isSubmissionModal: false,
            jobIdModal: ''
        };
    }

    toggleCollapse(){
        this.setState({ collapse: !this.state.collapse });
    }

    toggleSubmission(jobId){
        //alert(jobId);
        this.setState({ isSubmissionModal: !this.state.isSubmissionModal, jobIdModal: jobId });
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
        var data2 = {
            ...data, reward : this.web3.utils.fromWei(data.reward)
        };

        var pendingSpinner = this.props.Bounties.synced ? '' : ' 🔄';
        
        return (
            <div>
                <RenderBounty allBounties={this.props.allBounties} bounty={data2} pendingSpinner={pendingSpinner} toggleCollapse={this.toggleCollapse} isCollapse={this.state.collapse} accounts={this.props.accounts} toggleSubmission={this.toggleSubmission} />
                <Modal isOpen={this.state.isSubmissionModal} toggle={this.toggleSubmission}>
                    <ModalHeader toggle={this.toggleSubmission}>Bounty Form</ModalHeader>
                    <ModalBody>
                        <SubmissionForm jobId={this.state.jobIdModal} />
                    </ModalBody>
                </Modal>        
            </div>
        );
    }
}

Bounty.contextTypes = {
    drizzle: PropTypes.object
}

export default Bounty;