import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { userContext } from "./App";
import { ABI, RINKEBY_ADDRESS } from "./contracts/MyLazyMinting";
import { connectToMetamask } from "./utils/ConnectToMetamask";
import defaultImg from "./images/default.jpg";
import { ethers } from "ethers";
import catchAsync from "./utils/catchAsync";
import LazyMint from "./utils/getNFTSignature";

const NFTDetails = () => {
  const [nftPrice, setNftPrice] = useState("");
  const location = useLocation();
  const props = location.state;
  const [user, setUser] = useContext(userContext).userDetails;

  const [NftIPFSDetails, setNftIPFSDetails] = useState({});

  useEffect(() => {
    fetch(props.NFTArt.artLink)
      .then((response) => response.json())
      .then((data) => setNftIPFSDetails(data))
      .catch((err) => {
        alert(err.message);
      });
  }, []);

  //sell NFT function

  const handleNFTSell = catchAsync(async (e) => {
    e.preventDefault();
    const [provider, accounts, signer] = await connectToMetamask();

    //read mode instance
    const myLazyMintRead = new ethers.Contract(RINKEBY_ADDRESS, ABI, provider);
    const myLazyMintWrite = new ethers.Contract(RINKEBY_ADDRESS, ABI, signer);
    //get the minter role key from contract
    //check if the address is a minter or not
    //if not become a minter first
    if (
      !(await myLazyMintRead.hasRole(
        await myLazyMintRead.MINTER_ROLE(),
        accounts[0]
      ))
    ) {
      const tx = await myLazyMintWrite.SetMinterRole(accounts[0]);
    }

    //Format the NFT package
    const NFTPackage = {
      tokenId: props.NFTArt.tokenId,
      price: nftPrice,
      tokenURI: props.NFTArt.tokenURI,
    };

    const lazyMint = new LazyMint(RINKEBY_ADDRESS, signer);

    const signature = await lazyMint.getSignature(NFTPackage);

    console.log(signature);
  });

  return (
    <div className="NFTDetails">
      <h1>NFT Details</h1>
      <div className="imageContainer">
        {NftIPFSDetails.imageURI ? (
          <img
            src={`https://ipfs.moralis.io:2053/ipfs/${
              NftIPFSDetails.imageURI.split("//")[1]
            }`}
            alt="Nft art"
          />
        ) : (
          <img src={defaultImg} alt="default img" />
        )}
      </div>
      <div className="detailsContainer">
        <h1>{props.NFTArt.NFTArtDescription}</h1>
        {props.NFTArt.isTokenOnchain ? (
          //NFT data related to on chain
          <h1>The NFT is present on chain</h1>
        ) : //NFT data related to off chain
        user._id === props.NFTArt.user ? (
          //if owner of the NFt
          <div className="sellTheNFT">
            <h1>I am the owner if this NFT</h1>
            <div className="sellNft">
              <form onSubmit={handleNFTSell}>
                <input
                  type="text"
                  placeholder="in ether"
                  onChange={(e) => setNftPrice(e.target.value)}
                />
                <button type="submit">Sell NFT</button>
              </form>
            </div>
          </div>
        ) : (
          // not the owner
          <h1>I am not owner</h1>
        )}
      </div>
    </div>
  );
};

export default NFTDetails;
