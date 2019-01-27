import React from 'react'
import { Row, Col } from 'reactstrap';

function SubmissionHeader(props){
    if(props.jobId)
        return (
            <div>
                <Row>
                    <Col xs="7" className="text-center bg-primary text-white border border-dark">
                        <strong>Proposed Solution</strong>
                    </Col>
                    <Col xs="4" className="text-center bg-primary text-white border border-dark">
                        <strong>Submitted by</strong>
                    </Col>
                    <Col xs="1" className="text-center bg-primary text-white border border-dark">
                        <strong>Action</strong>
                    </Col>
                </Row>
            </div>
        );
    else
        return (
            <div>
                <Row>
                    <Col xs="8" className="text-center bg-primary text-white border border-dark">
                        <strong>Proposed Solution</strong>
                    </Col>
                    <Col xs="3" className="text-center bg-primary text-white border border-dark">
                        <strong>Is It Selected ?</strong>
                    </Col>
                    <Col xs="1" className="text-center bg-primary text-white border border-dark">
                        <strong>Action</strong>
                    </Col>
                </Row>
            </div>
        );
}

export default SubmissionHeader;