import React, { Component } from 'react'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import BountyForm from './BountyForm'

class BountyModal extends Component{

    constructor(props, context) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);

        this.state = {
            isBountyModalOpen: false
        };
    }

    toggleModal(){
        this.setState({
            isBountyModalOpen: !this.state.isBountyModalOpen
        });
    }

    render(){
        return(
            <div>
                <Button outline onClick={this.toggleModal}><span className="fa fa-plus-square fa-lg"></span> Create Bounty</Button>
                <Modal isOpen={this.state.isBountyModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Bounty Form</ModalHeader>
                    <ModalBody>
                        <BountyForm toggleModal={this.toggleModal} />
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
  
export default BountyModal;