import { useContext, useEffect, useState } from "react";
import { userContext } from "./App";
import AxiosInstance from "./axoisInstancs";
import NFTCard from "./NFTCard";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [nfts, setNfts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    AxiosInstance("api/nft/allNfts")
      .then((response) => {
        setNfts(response.data.data.nftCollections);
      })
      .catch((err) => alert(err.message));

    const state = location.state;
    if (state) {
      state === "fromSell" &&
        (() => toast.success("NFT listed successfully"))();
    }
  }, [location.key]);

  return (
    <div className="home mx-4">
      <p className=" text-4xl font-bold w-fit mx-auto p-4 border-b-4 border-black">
        Explore All NFTs
      </p>
      <div className="flex justify-around flex-wrap">
        {nfts ? (
          nfts.map((nftDetail, idx) => <NFTCard key={idx} NFTArt={nftDetail} />)
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
      {/* signUp, signIn,Logged out toast handled from app.js. As after auth operation we are navigating to home page*/}
      <ToastContainer />
    </div>
  );
};

export default Home;
