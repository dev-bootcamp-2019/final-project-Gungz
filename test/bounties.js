var Bounties = artifacts.require("./Bounties.sol");

contract('Bounties', function(accounts) {
  
  const jobPoster = accounts[0];
  const submissionPoster = accounts[1];
  const jobName = "Test";
  const jobDesc = "Test 123";
  const jobReward = 300000000;
  const submissionDesc = "Test 123456";
  
  /**
   * This test is to ensure job creation is successful and reward that is agreed 
   * is stored to the contract from the job poster account
   */
  it("...should be able to create a new job.", function() {
    return Bounties.deployed().then(function(instance) {
      bounties = instance;
      return bounties.createJob(jobName, jobDesc, jobReward, {from: jobPoster, value: jobReward})
    }).then(function() {
      return bounties.getJobsLength.call();  
    }).then(function(numJob) {
      assert.equal(numJob, 1, "No job was stored.");
      return bounties.balance.call();
    }).then(function(balance) {
      assert.equal(balance, jobReward, "The value " + jobReward + " was not stored in contract balance.");
    });
  });

  /**
   * This test is to ensure proposed solution can be submitted for a job
   */
  it("...should be able to create a new submission.", function() {
    return Bounties.deployed().then(function(instance) {
      bounties = instance;
      return bounties.submitProposal(0, submissionDesc, {from: submissionPoster})
    }).then(function() {
      return bounties.getSubmissionByJobID.call(0, 0);  
    }).then(function(submission) {
      assert.equal(submission.description, submissionDesc, "Submission Description doesn't match.");
    });  
  });

  /**
   * This test is to ensure proposed solution can be accepted by job creator
   */
  it("...should be able to accept a submission for a job.", function() {
    return Bounties.deployed().then(function(instance) {
      bounties = instance;
      return bounties.acceptSubmission(0, {from: jobPoster});
    }).then(function() {
      return bounties.getJobsByPoster.call(0, {from: jobPoster});  
    }).then(function(job) {
      assert.equal(job[0].finished, true, "Job status is not finished.");
    });  
  });  

  /**
   * This test is to ensure payment can be withdrawn by solution provider 
   * once solution is accepted
   */
  it("...should be able to withdraw payment after solution is accepted.", function() {
    return Bounties.deployed().then(function(instance) {
      bounties = instance;
      return bounties.withdrawPayment(0, {from: submissionPoster});
    }).then(function() {
      return bounties.getSubmissionByJobID.call(0, 0);  
    }).then(function(submission) {
      assert.equal(submission.rewardTaken, true, "Reward is not taken.");
      return bounties.balance.call();
    }).then(function(balance) {
      assert.equal(balance, 0, "Payment is not withdrawn from contract balance.");
    });  
  });  

  /**
   * This test is to ensure emergency stop flag can be toggled 
   */
  it("...should be able to toggle emergency stop flag.", function() {
    return Bounties.deployed().then(function(instance) {
      bounties = instance;
      return bounties.toggleActive({from: jobPoster});
    }).then(function() {
      return bounties.stopped.call();  
    }).then(function(stopped) {
      assert.equal(stopped, true, "Emergency flag fails to be activated.");
    });  
  }); 
});
