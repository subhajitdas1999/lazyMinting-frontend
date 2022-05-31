# lazyminting-frontend

[Overview](#overview)<br>
[Important Links](#important-links)<br>
[Project Setup](#project-setup)<br>

## **Overview**

By using this simple UI user can Register themselves to this site,upload, sell, but NFTS.

- To upload an NFT

  1. User need to authenticate
  2. Go to My profile (by clicking the user image in the header)
  3. Add Details of the NFT and NFT file . Upload the NFT file

- To sell an NFT
  1. Go to myNFTs on my account section
  2. click on the desired NFT
  3. connect your metamask
  4. sell the NFT

Note :- If the NFT is off chain then during sell user need register themselves as a minter for once (other wise NFT will be Invalid on chain and nobody will be able to purchased NFT's signed by you) and sign the NFT . If the NFT is on chain the user need to approve the contract for their account address for once and sign the NFT.

- To buy an NFT
  1. Click on the desired NFT card
  2. connect your metamask
  3. Buy the NFT

Note :- If you buying an off chain NFT you need pay the gas fees for minting the NFT along with NFT price.

---

## **Important Links**

- The frontend deployed [link](https://lazy-minting-frontend.herokuapp.com/)

- backend deployed [link](https://my-lazy-minting.herokuapp.com/)

- backend github [link](https://github.com/subhajitdas1999/lazyMinting-backend)

- smart contract github [link](https://github.com/subhajitdas1999/lazyMinting-SC)

- smart contract [etherscan](https://rinkeby.etherscan.io/address/0x1A87B7cb5A1Ae22Cd8C009ECFE31A3ef4826421d#code)

---

## **Project Setup**

1. clone the repo

```
git clone https://github.com/subhajitdas1999/lazyminting-frontend.git
```

2. change the directory and change branch if required

```
cd lazyMinting-frontend
```

3. create a .env file ,See the .env.example file for details

4. Install dependencies

```
npm i
```

5. Run


```
npm start
```