pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import 'zeppelin/contracts/ReentrancyGuard.sol';
import 'zeppelin/contracts/ownership/Ownable.sol';

/** @title Bounties. */
contract Bounties is ReentrancyGuard, Ownable {

    constructor(string name) Ownable() public {
        contractName = name;
    }

    // Event to log if a job is successfully created
    event jobCreated(address indexed jobPoster, uint jobId, string jobName);
    // Event to log if a submission for a job is successfully created
    event submissionCreated(address indexed submissionPoster, uint submissionId, uint jobId);
    // Event to log that payment for bounty has been received to be stored temporarily in contract
    event Received(address indexed _from, uint _value);
    // Event to log that submission for a bounty has been accpeted
    event submissionAccepted(address indexed submissionPoster, uint submissionId, uint jobId);
    // Event to log that payment for accepted submssion has been withdrawn
    event paymentWithdrawn(address indexed submissionPoster, uint submissionId, uint jobId, uint value);

    // Struct to contain data about Job / Bounty posted by user
    struct Job {
        uint id;
        string name;
        string description;
        uint reward;
        address jobPoster;
        bool finished;
    }

    // Struct to contain data about proposed solution for a given job / bounty
    struct Submission {
        uint submissionId;
        uint jobId;
        address submissionPoster;
        string description;
        bool chosen;
        bool rewardTaken;
    }

    /*
        State Variables 
    */
    // Variable to hold number of jobs in the contract
    uint public numJob;
    // Variable to hold number of submissions in the contract
    uint internal numSubmission;
    // Variable to lookup list of jobs by poster
    mapping (address => Job[]) internal jobsByPoster;
    // Variable to lookup job by its ID
    mapping (uint => Job) internal jobsMapping;
    // Variable to hold all jobs that exist in the contract
    Job[] internal jobs;
    // Variable to lookup submissions of solution by job ID
    mapping (uint => Submission[]) internal submissionByJobId;
    // Variable to lookup submission of solution by its ID
    mapping (uint => Submission) internal submissions;
    // Variable to lookup list of submissions by its poster
    mapping (address => Submission[]) internal submissionByPoster; 
    // Variable for circuit breaker / emergency stop
    bool public stopped;
    // Variable to hold the name of Bounties contract
    string public contractName;
    // Variable to hold total balance of Ether that has been stored to the Contract by Job Poster
    uint public balance;
    // Variable to hold amount of Ether per address
    mapping (address => uint) internal balanceMapping;

    /*
        Functions
    */
    /** @dev Create a new bounty / job and store it in the contract.
      * @param name name of the job.
      * @param description description of what needs to be done by the person willing to take the job.
      * @param reward reward of the job (in wei).
      * @return jobId the id of created job.
      */
    function createJob(string name, string description, uint reward) 
        nonReentrant
        stopIfEmergency
        public payable
        returns(uint jobId)
    {
        jobId = numJob++;

        Job memory job = Job(jobId, name, description, reward, msg.sender, false);
        jobsByPoster[msg.sender].push(job);
        jobs.push(job);
        jobsMapping[jobId] = job;
        emit jobCreated(msg.sender, jobId, name);

        require(balance + msg.value > balance);
        balance += msg.value;
        balanceMapping[msg.sender] += msg.value; 
        emit Received(msg.sender, msg.value);
    }

    /** @dev Submit a proposed solution for a given job.
      * @param jobId Id of the job for which the solution is proposed.
      * @param description description of the proposed solution.
      * @return submissionId the id of submitted proposal.
      */
    function submitProposal(uint jobId, string description) 
        nonReentrant
        stopIfEmergency
        public
        returns(uint submissionId)
    {
        submissionId = numSubmission++;

        Submission memory submission = Submission(submissionId, jobId, msg.sender, description, false, false);
        submissions[submissionId] = submission;
        submissionByJobId[jobId].push(submission);
        submissionByPoster[msg.sender].push(submission);
        emit submissionCreated(msg.sender, submissionId, jobId);
    }

    /** @dev toggling flag for circuit breaker / emergency stop.
      */
    function toggleActive() onlyOwner public {
      stopped = !stopped;
    }

    /** @dev modifier so that function can't be executed 
      * if emergency flag is active.
      */
    modifier stopIfEmergency() {
        require(!stopped);
        _;
    }

    /** @dev modifier for a function that can be executed 
      * only if emergency flag is active.
      */
    modifier emergencyOnly() {
        require(stopped);
        _;
    }

    function getJobsByPoster() constant returns (Job[]) {
        return jobsByPoster[msg.sender];
    }

    function getJobsByPosterLength() constant returns (uint) {
        return jobsByPoster[msg.sender].length;
    }

    function getSubmissionByJobIDLength(uint jobId) constant returns(uint){
        return submissionByJobId[jobId].length;
    }

    function getSubmissionByJobID(uint jobId) constant returns(Submission[]){
        return submissionByJobId[jobId];
    }

    function getSubmissionByJobID(uint jobId, uint index) constant returns(Submission){
        return submissionByJobId[jobId][index];
    }

    function getJobsLength() constant returns (uint){
        return jobs.length;
    }

    function getJobs(uint index) constant returns (Job){
        return jobs[index];
    }

    function getJobsByPoster(uint index) constant returns (Job) {
        return jobsByPoster[msg.sender][index];
    }

    function getSubmissionsByPosterLength() constant returns (uint){
        return submissionByPoster[msg.sender].length;
    }

    function getSubmissionsByPoster(uint index) constant returns (Submission) {
        return submissionByPoster[msg.sender][index];
    }

    /** @dev As a job owner, accept submission for a proposed solution.
      * @param submissionId Id of the submission
      * @return balance of job owner in the contract after the payment 
      * is deducted and sent to balance of approved submission poster.
      */
    function acceptSubmission(uint submissionId) 
        nonReentrant
        stopIfEmergency 
        public returns (uint){
        Submission storage sub = submissions[submissionId];
        Job storage job = jobsMapping[sub.jobId];
        require(msg.sender == job.jobPoster);
        require(job.finished != true);
        require(sub.chosen != true);
        require(balanceMapping[job.jobPoster] >= job.reward);
        sub.chosen = true;
        job.finished = true;

        uint jobsByPosterLength = getJobsByPosterLength();
        for(uint i=0; i<jobsByPosterLength; i++){
            Job storage job2 = jobsByPoster[msg.sender][i];
            if(job2.id == job.id){
                job2.finished = true;
            }
        }

        uint jobsLength = getJobsLength();
        for(i=0; i<jobsLength; i++){
            Job storage job3 = jobs[i];
            if(job3.id == job.id){
                job3.finished = true;
            }
        }

        uint submissionsByJobIDLength = getSubmissionByJobIDLength(job.id);
        for(i=0; i<submissionsByJobIDLength; i++){
            Submission storage submission = submissionByJobId[job.id][i];
            if(submission.submissionId == submissionId){
                submission.chosen = true;
            }
        }

        uint submissionsByPosterLength = submissionByPoster[sub.submissionPoster].length;
        for(i=0; i<submissionsByPosterLength; i++){
            Submission storage submission2 = submissionByPoster[sub.submissionPoster][i];
            if(submission2.submissionId == submissionId){
                submission2.chosen = true;
            }
        }

        balanceMapping[msg.sender] -= job.reward;
        balanceMapping[sub.submissionPoster] += job.reward;
        emit submissionAccepted(sub.submissionPoster, submissionId, job.id);
        return balanceMapping[msg.sender];
    }

    /** @dev As a solution provider, withdraw payment if my solution is accepted.
      * @param submissionId Id of the submission
      * @return job.reward amount of ether (in wei) paid as reward.
      */
    function withdrawPayment(uint submissionId) 
        nonReentrant
        stopIfEmergency 
        public returns (uint){
        Submission storage submission = submissions[submissionId];
        Job storage job = jobsMapping[submissions[submissionId].jobId];
        require(submission.submissionPoster == msg.sender);
        require(balance >= job.reward);
        require(balanceMapping[msg.sender] >= jobReward);
        require(submission.rewardTaken == false);
        balanceMapping[msg.sender] -= job.reward;
        balance -= job.reward;
        submission.rewardTaken = true;

        uint submissionsByJobIDLength = getSubmissionByJobIDLength(job.id);
        for(uint i=0; i<submissionsByJobIDLength; i++){
            Submission storage submission2 = submissionByJobId[job.id][i];
            if(submission2.submissionId == submissionId){
                submission2.rewardTaken = true;
            }
        }

        uint submissionsByPosterLength = submissionByPoster[msg.sender].length;
        for(i=0; i<submissionsByPosterLength; i++){
            Submission storage submission3 = submissionByPoster[msg.sender][i];
            if(submission3.submissionId == submissionId){
                submission3.rewardTaken = true;
            }
        }

        msg.sender.transfer(job.reward);
        emit paymentWithdrawn(submission.submissionPoster, submission.submissionId, job.id, job.reward);
        return job.reward;
    }

    function () public payable {
        revert () ; 
    }      
}