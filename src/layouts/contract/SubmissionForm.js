import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Button, Row, Col, Label } from 'reactstrap';

const required = (val) => val && val.length;
const minLength = (len) => (val) => val && (val.length >= len);

/*
 * Create component.
 */

class SubmissionForm extends Component {
  constructor(props, context) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);

    this.contracts = context.drizzle.contracts;
    this.web3 = context.drizzle.web3;
    this.store = context.drizzle.store;
  }

  handleSubmit(values) {
    if (this.props.sendArgs) {
      return this.contracts["Bounties"].methods["submitProposal"].cacheSend(...Object.values(values), this.props.sendArgs);
    }
    //alert(JSON.stringify(values));
    return this.contracts["Bounties"].methods["submitProposal"].cacheSend(...Object.values(values));
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  resetForm(){
    document.getElementById("submissionForm").reset();
  }

  render() {
    return (
        <div>
            <LocalForm className="pure-form pure-form-stacked" id="submissionForm" onSubmit={(values) => this.handleSubmit(values)}>    
                <Control type="hidden" model=".jobId" defaultValue={this.props.jobId} />
                <Row className="form-group">
                    <Label htmlFor="submissionDesc" xs={4}>Proposed Solution</Label>
                    <Col xs={8}>
                        <Control.textarea model=".description" id="submissionDesc" name="submissionDesc"
                            placeholder="Proposed Solution" className="form-control" rows="12"
                            validators={{
                                required, minLength: minLength(3)
                            }} 
                        />
                        <Errors
                            className="text-danger"
                            model=".description"
                            show="touched"
                            messages={{
                                required: 'Required  ',
                                minLength: 'Must be greater than 2 characters'
                            }}
                        />                                        
                    </Col>
                </Row>
                <Row className="form-group">
                    <Col xs={{size:12, offset:5}}>
                        <Button key="submit" className="pure-button" type="submit">Submit</Button>
                        &nbsp; &nbsp;
                        <Button key="button" onClick={this.resetForm} className="pure-button" type="button">Reset</Button>
                    </Col>
                </Row>
            </LocalForm>
        </div>
    );
  }
}

SubmissionForm.contextTypes = {
  drizzle: PropTypes.object
}

/*
 * Export connected component.
 */

const mapStateToProps = state => {
  return {
    contracts: state.contracts,
    accounts: state.accounts,
    accountBalances: state.accountBalances  
  }
}

export default drizzleConnect(SubmissionForm, mapStateToProps);