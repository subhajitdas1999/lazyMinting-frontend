import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { userContext } from "./App";
import AxiosInstance from "./axoisInstancs.js";
import NFTCard from "./NFTCard";

const MyNFTs = () => {
  const [user] = useContext(userContext).userDetails;
  const [nfts, setNfts] = useState([]);
  const { state } = useLocation();
  useEffect(() => {
    AxiosInstance.get("api/nft/myNfts", { withCredentials: true })
      .then((response) => {
        setNfts(response.data.data.nftCollections);
      })
      .catch((err) => alert(err.message));

    //if nav from from nft upload , show the toast
    state === "uploadSuccessFull" &&
      (() => toast.success("NFT Upload Successful"))();
    
    //from NFT details , nft purchase
    state === "fromBuy" && (() => toast.success("NFT Purchased Successful"))()

  }, []);
  return (
    <div className="myNFTs mx-4">
      <p className="text-4xl font-bold w-fit mx-auto p-4 border-b-4 border-black">
        {user.name} NFTS
      </p>
      <div className="allNFTs flex justify-around flex-wrap">
        {nfts ? (
          nfts.map((nftDetail, idx) => <NFTCard key={idx} NFTArt={nftDetail} />)
        ) : (
          <h1>Loading...</h1>
        )}
      </div>

      {/* NFT upload successful */}
      <ToastContainer />
    </div>
  );
};

export default MyNFTs;
