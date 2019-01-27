# final-project-Gungz

## How to run
1. Import this repository
2. Ensure the ganache-cli and truffle have been installed
3. Change directory to location where this repository is imported
4. Open a terminal, yarn install
5. Open 2nd terminal, ganache-cli or ganache-cli -b 3 if you want to have some delay on private blockchain
6. In 1st terminal, execute truffle compile
7. In 1st terminal, execute truffle migrate
8. In 1st terminal, execute yarn start
9. Open web browser (firefox quantum recommended), go to URL http://localhost:3000

## How to execute unit test
1. In the directory where repository is imported, execute truffle test

## Familiarize yourself with this app (tested using Firefox Quantum in Ubuntu 16.04)
1. When the web app is 1st opened and the blockchain is still empty, there's nothing to display except the account used by metamask to connect to this web app
2. Click Create Bounty, modal screen will appear
3. Enter name, description, reward
4. Click Submit, Click Confirm on MetaMask
5. You can see the new Bounty is available on the screen and your account's Ether will be reduced
6. Close the modal screen
7. Switch tab to see it appears also on All Posted Bounties
8. You can't propose solution for it because it is your own Bounty
9. Using Metamask, change to another account
10. The web page will be refreshed and blank screen will appear (there's some issue with Drizzle it seems)
11. Worry not, just refresh the screen (like by clicking CTRL+R in Firefox)
12. Go to tab All Posted Bounties
13. Propose a solution for a job using button Propose, a modal screen will appear
14. Fill in description
15. Click Submit, Click Confirm on MetaMask
16. Close the modal screen
17. You can go to My Submission to see that your Submission has been stored in the blockchain
18. Switch account again to the account that creates the Bounty (1st account)
19. Remember to refresh if blank page appears
20. In My Posted Bounties tab, hover to the created job and click on it
21. The proposed solution will appear below 
22. Click Accept, Click Confirm on MetaMask
23. The job / bounty will change status to Completed
24. Again, switch to account that submits the proposed solution (2nd account)
25. Go to My Submission tab, notice there's Withdraw button, click it, then click Confirm on MetaMask
26. The Withdraw button will disappear because you have withdrawn your reward and Ether in your account will increase