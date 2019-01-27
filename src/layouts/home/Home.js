import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import { TabContent, Button, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import logo from '../../logo.png'
import classnames from 'classnames';
import PropTypes from 'prop-types'
import BountiesContainer from '../contract/BountiesContainer'
import BountyModal from '../contract/BountyModal'
import SubmissionsContainer from '../contract/SubmissionsContainer'

function RenderBountiesHeader({allBounties}){
  if(allBounties)
    return(
      <Row>
        <Col xs="3" className="text-center bg-primary text-white border border-dark"><strong>Name</strong></Col>
        <Col xs="4" className="text-center bg-primary text-white border border-dark"><strong>Description</strong></Col>
        <Col xs="2" className="text-center bg-primary text-white border border-dark"><strong>Reward (in Ether)</strong></Col>
        <Col xs="2" className="text-center bg-primary text-white border border-dark"><strong>Status</strong></Col>
        <Col xs="1" className="text-center bg-primary text-white border border-dark"><strong>Action</strong></Col>
      </Row>
    );
  else
    return(
      <Row>
        <Col xs="3" className="text-center bg-primary text-white border border-dark"><strong>Name</strong></Col>
        <Col xs="5" className="text-center bg-primary text-white border border-dark"><strong>Description</strong></Col>
        <Col xs="2" className="text-center bg-primary text-white border border-dark"><strong>Reward (in Ether)</strong></Col>
        <Col xs="2" className="text-center bg-primary text-white border border-dark"><strong>Status</strong></Col>
      </Row>
    );
}

class Home extends Component {
  constructor(props, context) {
    super(props);

    this.tabToggle = this.tabToggle.bind(this);
    this.contracts = context.drizzle.contracts;
    this.toggleModal = this.toggleModal.bind(this);

    this.state = {
      activeTab: '1',
      isBountyModalOpen: false
    };
  }

  componentDidMount(){
    console.log("component did mount");
  }

  tabToggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  toggleModal(){
    this.setState({
      isBountyModalOpen: !this.state.isBountyModalOpen
    });
  }


  render() {
    /*var myPostedBountiesComp = <span>Loading..</span>;
    if(!(this.dataKeyForJobsByPosterLength in this.props.contracts["Bounties"]["getJobsByPosterLength"])) {
      console.log("MyPostedBounties is not yet in cache");
    }else{
      let length = this.props.contracts["Bounties"]["getJobsByPosterLength"][this.dataKeyForJobsByPosterLength].value;
      if(typeof length !== 'undefined'){
        for (let i = 0; i < length; i++) {
          this.contracts.Bounties.methods.getJobsByPoster(i).call()
           .then((bounty) => {
            this.setState({
              bounties: [...this.state.bounties, bounty]
            });
           });
        }
      }else{
        this.contracts.Bounties.methods.getJobsByPosterLength().call().then((num)=>{
          console.log("Length inside jobsByPoster callback: " + num);
          for (let i = 0; i < num; i++) {
            this.contracts.Bounties.methods.getJobsByPoster(i).call()
             .then((bounty) => {
                console.log("Bounty: " + JSON.stringify(bounty));
                this.setState({
                  bounties: [...this.state.bounties, bounty]
                })
                console.log("My Posted Bounties in Callback: " + JSON.stringify(this.state.bounties));
             });
          }
        });
      }
      console.log("length of job:" + JSON.stringify(length));
      console.log("type of length of job:" + typeof length);
      //console.log("MyPostedBountiesArray: " + JSON.stringify(myPostedBounties));
    }
    console.log("Bounties state: " + JSON.stringify(this.state.bounties));
    if(this.state.bounties.length>0){
      myPostedBountiesComp = this.state.bounties.map((bounty)=>{
        return(
          <RenderBounty bounty={bounty} />
        );
      });
    }*/

    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <img src={logo} alt="drizzle-logo" />
            <h1>Bounty Apps</h1>
            <div>Marketplace of Bounties where You can Post Bounties for People to Work on</div>
            <br />
          </div>

          <div className="pure-u-1-1">
            <h2>Your Active Account</h2>
            <AccountData accountIndex="0" units="ether" precision="3" />
          </div>

          <div className="pure-u-1-1">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.tabToggle('1'); }}>
                    My Posted Bounties
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.tabToggle('2'); }}>
                    All Posted Bounties
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '3' })}
                  onClick={() => { this.tabToggle('3'); }}>
                    My Submission
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col xs="12">
                    <RenderBountiesHeader />
                    <BountiesContainer method="getJobsByPoster" />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col xs="12">
                    <RenderBountiesHeader allBounties="true" />
                    <BountiesContainer method="getJobs" allBounties="true" />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="3">
                <Row>
                  <Col xs="12">
                    <SubmissionsContainer method="getSubmissionsByPoster" />
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </div>
          <div className="pure-u-1-1">
            <br />
            <Row>
              <Col xs="3"><BountyModal /></Col>
            </Row>
          </div>
        </div>
      </main>
    )
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object
}

export default Home
