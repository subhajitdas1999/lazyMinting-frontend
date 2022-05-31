import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userContext } from "./App";
import { ABI, RINKEBY_ADDRESS } from "./contracts/MyLazyMinting";
import { connectToMetamask } from "./utils/ConnectToMetamask";
import { ethers } from "ethers";
import catchAsync from "./utils/catchAsync";
import LazyMint from "./utils/getNFTSignature";
import AxiosInstance from "./axoisInstancs";
import { BsInfoCircleFill } from "react-icons/bs";
import { LoadingModal } from "./Modal";
import { FaEthereum } from "react-icons/fa";
import MetaLoader from "./images/metaLoading.gif";
import DoneImg from "./images/done.gif";
import Spinner from "./images/spinner.gif";
import Blocks from "./images/blocks.gif";

const NFTDetails = () => {
  const [txModal, setTxModal] = useState({
    offChainSell: false,
    onChainSell: false,
    NFTBuy: false,
    onChainBuy: false,
    minterRole: false,
    signedNFT: false,
    approvedContract: false,
  });
  const [nftPrice, setNftPrice] = useState("");
  const [accounts, setAccounts] = useState([]);
  const nav = useNavigate();
  const location = useLocation();
  const nftCompleteData = location.state;
  const [user, setUser] = useContext(userContext).userDetails;

  useEffect(() => {
    (async () => {
      await handleMetamaskConnection();
    })();
  }, []);

  const handleTxModalClose = () => {
    setTxModal({
      offChainSell: false,
      onChainSell: false,
      NFTBuy: false,
      onChainBuy: false,
      minterRole: false,
      signedNFT: false,
      approvedContract: false,
    });
  };

  //sell NFT function
  const handleNFTSell = catchAsync(async (e) => {
    e.preventDefault();

    // Connect to metamask
    const [provider, accounts, signer] = await connectToMetamask();

    //checking the network
    const chainId = await signer.getChainId();
    if (chainId !== 4) {
      alert("connect you metamask to rinkeby network");
      return;
    }

    //get write mode instance
    const myLazyMintReadWrite = new ethers.Contract(
      RINKEBY_ADDRESS,
      ABI,
      signer
    );

    if (nftPrice < process.env.REACT_APP_MIN_NFT_PRICE) {
      alert(
        `Minimum price for NFT selling is ${process.env.REACT_APP_MIN_NFT_PRICE} Ether`
      );
      return;
    }

    //if the NFT on chain
    if (nftCompleteData.db.NFTArt.isTokenOnchain) {
      //if not approved
      //open the modal
      setTxModal((prev) => {
        return {
          ...prev,
          onChainSell: true,
        };
      });

      // console.log(txModal);
      if (
        !(await myLazyMintReadWrite.isApprovedForAll(
          accounts[0],
          myLazyMintReadWrite.address
        ))
      ) {
        //  Approve the NFT
        const approveTx = await myLazyMintReadWrite.setApprovalForAll(
          myLazyMintReadWrite.address,
          true
        );

        //wait for the tx to mint
        await approveTx.wait();
      }
      //approved the tx
      setTxModal((prev) => {
        return {
          ...prev,
          approvedContract: true,
        };
      });
    }
    //if the NFT off chain
    else {
      //open the modal
      setTxModal((prev) => {
        return {
          ...prev,
          offChainSell: true,
        };
      });

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
      //minter role done in modal
      setTxModal((prev) => {
        return {
          ...prev,
          minterRole: true,
        };
      });
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

    ///signature done in modal
    setTxModal((prev) => {
      return {
        ...prev,
        signedNFT: true,
      };
    });
    const res = await AxiosInstance.post(
      "api/nft/sellNFT",
      {
        id: nftCompleteData.db.NFTArt._id,
        signature,
        price: nftPrice,
      },
      { withCredentials: true }
    );

    //close the modal
    handleTxModalClose();

    setNftPrice("");
    //navigate to home page
    nav("/",{state : "fromSell"});
  }, handleTxModalClose);

  //off chain purchasing
  const handleNFTPurchase = catchAsync(async () => {
    const [provider, accounts, signer] = await connectToMetamask();

    //checking the network
    const chainId = await signer.getChainId();
    if (chainId !== 4) {
      alert("connect you metamask to rinkeby network");
      return;
    }

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

    //open the purchasing token
    setTxModal((prev) => {
      return {
        ...prev,
        NFTBuy: true,
      };
    });

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

    //close the buying modal
    handleTxModalClose();
    //update in database
    await AxiosInstance.post(
      "api/nft/buyNFT",
      {
        id: nftCompleteData.db.NFTArt._id,
        ownerAddress: accounts[0],
      },
      { withCredentials: true }
    );

    //nav to home page
    nav("/myNFTs",{state:"fromBuy"});
  }, handleTxModalClose);

  const handleMetamaskConnection = async () => {
    try {
      const [provider, accounts, signer] = await connectToMetamask();
      //checking the network
      const chainId = await signer.getChainId();
      if (chainId !== 4) {
        alert("connect you metamask to rinkeby network");
      }
      setAccounts(accounts);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="nftDetails mx-4">
      <p className="text-4xl font-bold w-fit mx-auto p-4 border-b-4 border-black">
        NFT Details
      </p>
      {user._id ? (
        <div className="NFTDetails mt-6">
          {accounts.length > 0 ? (
            <p className=" w-fit text-xl mx-auto border-b-2">
              You are connected with{" "}
              <span className=" font-bold">{accounts[0]}</span>
            </p>
          ) : (
            <button
              className="block w-fit text-xl mx-auto uppercase bg-green-600 p-1 rounded text-white hover:bg-green-800 hover:shadow-lg"
              onClick={handleMetamaskConnection}
            >
              connect your wallet
            </button>
          )}
          <div className=" mt-7 flex">
            <div className="imageContainer flex-1 m-4">
              <div className=" w-96 h-96 mx-auto">
                <img
                  src={`https://ipfs.moralis.io:2053/ipfs/${
                    nftCompleteData.ipfs.imageURI.split("//")[1]
                  }`}
                  alt="Nft art"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="detailsContainer flex-1">
              <p className=" text-5xl mb-4">
                {nftCompleteData.db.NFTArt.artName}
              </p>
              <p className="text-4xl mb-4">
                {nftCompleteData.db.NFTArt.artDescription}
              </p>

              {nftCompleteData.db.NFTArt.isTokenOnchain ? (
                //NFT related to on chain
                accounts.length > 0 ? (
                  <div>
                    <p>This NFT is present on chain</p>

                    {accounts[0] === nftCompleteData.db.NFTArt.ownerAddress ? (
                      //if owner
                      <div className="sellOnChainNFT">
                        <p className=" my-2">This NFT is Owned by You</p>
                        <div className="sellNft">
                          <form
                            onSubmit={handleNFTSell}
                            className="flex items-center"
                          >
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control 
        
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="exampleInputSellPrice"
                                name="sellPrice"
                                placeholder="In Ether"
                                value={nftPrice}
                                onChange={(e) => setNftPrice(e.target.value)}
                                required
                              />
                            </div>

                            <button
                              type="submit"
                              className="
      ml-2
      px-6
      py-2.5
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out"
                            >
                              sell
                            </button>
                          </form>
                        </div>
                      </div>
                    ) : (
                      //not owner
                      <div className="buyOnchainNFT">
                        <div>
                          <p>
                            This NFT is owned by
                            {nftCompleteData.db.NFTArt.ownerAddress}
                          </p>
                          {nftCompleteData.db.NFTArt.isForSale ? (
                            //is for sale
                            <div className="readyToBuyOffChain">
                              <p className=" flex items-center justify-start w-fit my-4">
                                {nftCompleteData.db.NFTArt.sellPrice}{" "}
                                <FaEthereum />
                              </p>
                              <button
                                onClick={handleNFTPurchase}
                                className="
      
      px-6
      py-2.5
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out"
                              >
                                Buy the NFT
                              </button>
                            </div>
                          ) : (
                            //if not for sale yet
                            <h2>Not Ready for Buy yet</h2>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  //if metamask not connected
                  <div>
                    <h3>
                      This is an onChain NFT Connect your wallet to buy or sell
                    </h3>
                  </div>
                )
              ) : //NFT related to off chain
              user._id === nftCompleteData.db.NFTArt.user ? (
                //if owner of the NFt
                <div className="sellTheNFTOffChain">
                  <p className="flex items-center">
                    <BsInfoCircleFill />
                    <span className="ml-2 mb-1">
                      {" "}
                      you are the owner of this off chain NFT
                    </span>
                  </p>
                  <h2>sell the NFT for free</h2>
                  <div className="sellNft mt-6">
                    <form
                      onSubmit={handleNFTSell}
                      className="flex items-center"
                    >
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control 
        
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                          id="exampleInputSellPrice"
                          name="sellPrice"
                          placeholder="In Ether"
                          value={nftPrice}
                          onChange={(e) => setNftPrice(e.target.value)}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="
      ml-2
      px-6
      py-2.5
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out"
                      >
                        sell
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                // not the owner
                <div className="buyTheNftOffChain">
                  <h1>This is off chain NFT</h1>
                  {nftCompleteData.db.NFTArt.isForSale ? (
                    <div className="readyToBuyOffChain">
                      <p className=" flex items-center justify-start w-fit my-4">
                        {nftCompleteData.db.NFTArt.sellPrice} <FaEthereum />
                      </p>
                      <button
                        onClick={handleNFTPurchase}
                        className="
      
      px-6
      py-2.5
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out"
                      >
                        claim the NFT
                      </button>
                    </div>
                  ) : (
                    <p className=" font-bold mt-4 border-4 w-fit p-2 border-black"> Coming Soon</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="LoggedOut h-96 flex justify-center items-center flex-col">
          <div>
            <img src={Blocks} alt="" />
          </div>
          <p className=" font-bold text-4xl mt-12">
            Please log In to see more details
          </p>
        </div>
      )}
      {/* Modal for off chain nft sell */}
      <LoadingModal show={txModal.offChainSell}>
        <div
          className="flex flex-col justify-center mx-3"
          style={{ height: "100%" }}
        >
          <p
            className={`text-xl ${
              txModal.minterRole ? "text-green-500" : ""
            } flex items-center my-3`}
          >
            <img src={txModal.minterRole ? DoneImg : MetaLoader} alt="" />
            <span className=" ml-3 font-bold"> Become A Minter </span>
          </p>
          <p
            className={`text-xl ${
              txModal.signedNFT ? "text-green-500" : ""
            } flex items-center my-3`}
          >
            <img
              src={
                txModal.minterRole && txModal.signedNFT ? DoneImg : MetaLoader
              }
              alt=""
            />
            <span className=" ml-3 font-bold"> Sign the NFT </span>
          </p>
        </div>
      </LoadingModal>
      {/* Modal for on chain NFT sell */}
      <LoadingModal show={txModal.onChainSell}>
        <div
          className="flex flex-col justify-center mx-3"
          style={{ height: "100%" }}
        >
          <p
            className={`text-xl ${
              txModal.approvedContract ? "text-green-500" : ""
            } flex items-center my-3`}
          >
            <img src={txModal.approvedContract ? DoneImg : MetaLoader} alt="" />
            <span className=" ml-3 font-bold"> Approved the Contract </span>
          </p>
          <p
            className={`text-xl ${
              txModal.signedNFT ? "text-green-500" : ""
            } flex items-center my-3`}
          >
            <img
              src={
                txModal.approvedContract && txModal.signedNFT
                  ? DoneImg
                  : MetaLoader
              }
              alt=""
            />
            <span className=" ml-3 font-bold"> Sign the NFT </span>
          </p>
        </div>
      </LoadingModal>
      {/* Modal for NFT buy */}
      <LoadingModal show={txModal.NFTBuy}>
        <div
          className="flex flex-col justify-center items-center mx-3"
          style={{ height: "100%" }}
        >
          <div className="">
            <img src={Spinner} alt="" />
          </div>
        </div>
      </LoadingModal>
    </div>
  );
};

export default NFTDetails;
