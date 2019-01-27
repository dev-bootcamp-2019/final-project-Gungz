import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Button, Row, Col, Label } from 'reactstrap';

const required = (val) => val && val.length;
const minLength = (len) => (val) => val && (val.length >= len);
//const notDecimal = (val) => val && val.toString().indexOf(".") === -1;
const decimalNumber = (val) => val && val.match(/^[-+]?[0-9]+(\.[0-9]+)*$/);

/*
 * Create component.
 */

class BountyForm extends Component {
  constructor(props, context) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);

    this.contracts = context.drizzle.contracts;
    this.web3 = context.drizzle.web3;
    this.store = context.drizzle.store;

    // Get the contract ABI
    /*const abi = this.contracts[this.props.contract].abi;

    this.inputs = [];
    var initialState = {
        name: '',
        description: '',
        reward: ''
    };*/

    // Iterate over abi for correct function.
    /*for (var i = 0; i < abi.length; i++) {
        if (abi[i].name === this.props.method) {
            this.inputs = abi[i].inputs;

            for (var i = 0; i < this.inputs.length; i++) {
                initialState[this.inputs[i].name] = '';
            }

            break;
        }
    }*/

    //this.state = initialState;
  }

  handleSubmit(values) {
    if (this.props.sendArgs) {
      return this.contracts["Bounties"].methods["createJob"].cacheSend(...Object.values(values), this.props.sendArgs);
    }

    //var values2 = JSON.parse(JSON.stringify(values)); 
    //values2.reward = this.web3.utils.toWei(values.reward, "ether");
    var values2 = {
        ...values,
        reward: this.web3.utils.toWei(values.reward, "ether")
    };
    const sendArgs = {from: this.props.accounts[0], value: values2.reward};
    console.log("sendArgs:" + JSON.stringify(sendArgs));
    console.log("values2:" + JSON.stringify(values2));
    return this.contracts["Bounties"].methods["createJob"].cacheSend(...Object.values(values2), sendArgs);
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  resetForm(){
    document.getElementById("jobForm").reset();
  }

  render() {
    return (
        <div>
            <LocalForm className="pure-form pure-form-stacked" id="jobForm" onSubmit={(values) => this.handleSubmit(values)}>
                <Row className="form-group">
                    <Label htmlFor="bountyName" xs={5}>Bounty Name</Label>
                    <Col xs={7}>
                        <Control.text model=".name" id="bountyName" name="bountyName"
                            placeholder="Bounty Name" className="form-control" 
                            validators={{
                                required, minLength: minLength(3)
                            }} 
                        />
                        <Errors
                            className="text-danger"
                            model=".name"
                            show="touched"
                            messages={{
                                required: 'Required  ',
                                minLength: 'Must be greater than 2 characters'
                            }}
                        />                                        
                    </Col>
                </Row>
                <Row className="form-group">
                    <Label htmlFor="bountyDesc" xs={5}>Bounty Description</Label>
                    <Col xs={7}>
                        <Control.textarea model=".description" id="bountyDesc" name="bountyDesc"
                            placeholder="Bounty Description" className="form-control" rows="12"
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
                    <Label htmlFor="bountyReward" xs={5}>Bounty Reward (in Ether)</Label>
                    <Col xs={7}>
                        <Control.text model=".reward" id="bountyReward" name="bountyReward"
                            placeholder="Bounty Reward" className="form-control" 
                            validators={{
                                required, decimalNumber
                            }} 
                        />
                        <Errors
                            className="text-danger"
                            model=".reward"
                            show="touched"
                            messages={{
                                required: 'Required  ',
                                decimalNumber: 'Only decimal number (using .) is supported'
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

BountyForm.contextTypes = {
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

export default drizzleConnect(BountyForm, mapStateToProps);