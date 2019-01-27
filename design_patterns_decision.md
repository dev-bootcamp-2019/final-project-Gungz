# Design Patterns Decision
This document explains Design Patterns implemented in Bounties.sol 

## Circuit Breaker / Emergency Stop

We choose to implement this design pattern to ensure we can protect the fund and state stored in the contract in case a malicious person finds the security hole of the contract.

This implementation can be found in modifier `stopIfEmergency` which doesn't allow the function to be executed if the stop flag is changed to true by contract owner.

## Withdrawal Pattern

We choose to implement this design pattern because we don't want to block payment for address that is not malicious. By using withdrawal pattern, the address that wants to withdraw the fund once the submission is approved will be responsible for the transfer by calling the specific method inside the Bounties contract that will transfer the fund to the address. If we don't use this pattern and there's malicious contract as payment destination (imagine if we push the payment inside `acceptSubmission` function), the function will always fail and revert which makes us unable to complete the additional logic (e.g. the job status will never change to complete) of the function prior to sending the payment.

The withdrawal pattern implemetation can be found in `withdrawPayment` function of Bounties.sol.

## Reflection on Design Pattern

After careful consideration and review, this Bounties.sol can be implemented by using Factory Contract design pattern where each Bounty / Job is a contract by itself and Bounties.sol will create a new Bounty contract instead of creating new struct object. The Bounty contract itself will be stored inside the parent contract (Bounties) similar to the Job struct in current implementation. The current implementation (due to my lack of knowledge) require redundant struct object manipulation (for both Job and Submission - see `acceptSubmission` and `withdrawPayment` function). Imagine if the struct is replaced by another contract address (e.g. Bounty.sol). Getting the contract address from any internal array or mapping, loads it and then change the contract's state will affect all the internal arrays and mappings. This doesn't happen in current implementation because the Job / Bounty is stored as struct object and it is put in multiple internal arrays and mappings which apparently hold individual copy instead of the reference like I originally thought.  