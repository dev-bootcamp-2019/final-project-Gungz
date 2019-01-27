# Avoiding Common Attacks
This document explains how I guard the Contract (Bounties.sol) to avoid commo attacks 

## Race conditions: reentrancy

As you can see in `withdrawPayment` method, I am modifying the state first before transferring the reward to the recipient address, this will ensure the malicious attack will not be able to drain the contract by calling multiple times `withdrawPayment` function.

## Integer overflow

I've guarded against this attack by using this `require(balance + msg.value > balance)` in createJob function to ensure the contract balnace doesn't become 0 if the value sent to the contract is too high which causes the balance to overflow.

## Denial of Service

Implementing withdrawal design pattern and using `ReentrancyGuard` and its `nonReentrant` modifier (from OpenZeppelin EthPM package) should already avoid this issue.