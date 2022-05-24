import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { userContext } from "./App";
import { ABI, RINKEBY_ADDRESS } from "./contracts/MyLazyMinting";
import { connectToMetamask } from "./utils/ConnectToMetamask";
import { ethers } from "ethers";
import catchAsync from "./utils/catchAsync";
import LazyMint from "./utils/getNFTSignature";
import AxiosInstance from "./axoisInstancs";

const NFTDetails = () => {
  const [nftPrice, setNftPrice] = useState("");
  const [accounts, setAccounts] = useState([]);
  const location = useLocation();
  const nftCompleteData = location.state;
  const [user] = useContext(userContext).userDetails;

  //sell NFT function
  useEffect(() => {
    console.log(nftCompleteData);
    if (nftCompleteData.db.NFTArt.isTokenOnchain) {
      (async () => {
        await handleMetamaskConnection();
      })();
    }
  }, []);

  const handleNFTSellChain = catchAsync(async (e) => {
    e.preventDefault();

    // Connect to metamask
    const [provider, accounts, signer] = await connectToMetamask();

    //get write mode instance
    const myLazyMintReadWrite = new ethers.Contract(
      RINKEBY_ADDRESS,
      ABI,
      signer
    );

    //if the NFT on chain
    if (nftCompleteData.db.NFTArt.isTokenOnchain) {
      //if not approved


      
      //  Approve the NFT
      const approveTx = await myLazyMintReadWrite.setApprovalForAll(
        myLazyMintReadWrite.address,
        true
      );

      //wait for the tx to mint
      await approveTx.wait();
    }
    //if the NFT off chain
    else {
      //get the minter role key from contract
      //check if the address is a minter or not
      //if not become a minter first
      if (
        !(await myLazyMintReadWrite.hasRole(
          await myLazyMintReadWrite.MINTER_ROLE(),
          accounts[0]
        ))
      ) {
        const tx = await myLazyMintReadWrite.SetMinterRole(accounts[0]);

        await tx.wait();
      }
    }

    //Format the NFT package
    const NFTPackage = {
      tokenId: nftCompleteData.db.NFTArt.tokenId,
      price: ethers.utils.parseEther(nftPrice.toString()),
      tokenURI: nftCompleteData.db.NFTArt.tokenURI,
    };

    const lazyMint = new LazyMint(RINKEBY_ADDRESS, signer);
    //sign the NFT of the NFT
    const signature = await lazyMint.getSignature(NFTPackage);

    const res = await AxiosInstance.post("api/nft/sellNFT", {
      id: nftCompleteData.db.NFTArt._id,
      signature,
      price: nftPrice,
    });

    setNftPrice("");
  });

  //off chain purchasing
  const handleNFTPurchase = catchAsync(async () => {
    const [provider, accounts, signer] = await connectToMetamask();

    const myLazyMintReadWrite = new ethers.Contract(
      RINKEBY_ADDRESS,
      ABI,
      signer
    );

    const NFTPackage = {
      tokenId: nftCompleteData.db.NFTArt.tokenId,
      price: ethers.utils.parseEther(
        nftCompleteData.db.NFTArt.sellPrice.toString()
      ),
      tokenURI: nftCompleteData.db.NFTArt.tokenURI,
    };

    let purchaseTx;
    //if the token on chain
    if (nftCompleteData.db.NFTArt.isTokenOnchain) {
      purchaseTx = await myLazyMintReadWrite.purchaseNFT(
        NFTPackage,
        nftCompleteData.db.NFTArt.signatureForNFT,
        {
          value: ethers.utils.parseEther(
            nftCompleteData.db.NFTArt.sellPrice.toString()
          ),
        }
      );
    }
    // If the token off chain
    else {
      purchaseTx = await myLazyMintReadWrite.claimNFT(
        NFTPackage,
        nftCompleteData.db.NFTArt.signatureForNFT,
        {
          value: ethers.utils.parseEther(
            nftCompleteData.db.NFTArt.sellPrice.toString()
          ),
        }
      );
    }

    //wait for the Tx to be mined
    await purchaseTx.wait();

    //update in database
    await AxiosInstance.post("api/nft/buyNFT", {
      id: nftCompleteData.db.NFTArt._id,
      ownerAddress: accounts[0],
    });
  });

  const handleMetamaskConnection = async () => {
    const [provider, accounts, signer] = await connectToMetamask();
    setAccounts(accounts);
  };



  return (
    <div className="NFTDetails">
      <h1>NFT Details</h1>
      {console.log("rendered", accounts)}
      <div className="imageContainer">
        <img
          src={`https://ipfs.moralis.io:2053/ipfs/${
            nftCompleteData.ipfs.imageURI.split("//")[1]
          }`}
          alt="Nft art"
          style={{ width: "200px", height: "200px" }}
        />
      </div>
      <div className="detailsContainer">
        <h1>{nftCompleteData.db.NFTArt.artDescription}</h1>
        {nftCompleteData.db.NFTArt.isTokenOnchain ? (
          //NFT data related to on chain

          accounts.length > 0 ? (
            <div>
              {accounts[0] === nftCompleteData.db.NFTArt.ownerAddress ? (
                <div className="sellOnChainNFT">
                  <h1>I am the owner of this on chain NFT</h1>
                  <div className="sellNft">
                    <form onSubmit={handleNFTSellChain}>
                      <input
                        type="text"
                        placeholder="in ether"
                        value={nftPrice}
                        onChange={(e) => setNftPrice(e.target.value)}
                      />
                      <button type="submit">Sell NFT</button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="buyOnchainNFT">
                  {nftCompleteData.db.NFTArt.isForSale ? (
                    <div className="readyToBuyOffChain">
                      <h2>{nftCompleteData.db.NFTArt.sellPrice} Ether</h2>
                      <button onClick={handleNFTPurchase}>Buy the NFT</button>
                    </div>
                  ) : (
                    <h2>Not Ready for Buy yet</h2>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button onClick={handleMetamaskConnection}>
              Connect to metamask to Buy or Sell
            </button>
          )
        ) : //NFT data related to off chain
        user._id === nftCompleteData.db.NFTArt.user ? (
          //if owner of the NFt
          <div className="sellTheNFTOffChain">
            <h1>I am the owner if this NFT</h1>

            <div className="sellNft">
              <form onSubmit={handleNFTSellChain}>
                <input
                  type="text"
                  placeholder="in ether"
                  value={nftPrice}
                  onChange={(e) => setNftPrice(e.target.value)}
                />
                <button type="submit">Sell NFT</button>
              </form>
            </div>
          </div>
        ) : (
          // not the owner
          <div className="buyTheNftOffChain">
            <h1>This is off chain NFT</h1>
            {nftCompleteData.db.NFTArt.isForSale ? (
              <div className="readyToBuyOffChain">
                <h2>{nftCompleteData.db.NFTArt.sellPrice} Ether</h2>
                <button onClick={handleNFTPurchase}>claim the NFT</button>
              </div>
            ) : (
              <h2>Not Ready for Buy yet!!!!</h2>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTDetails;
