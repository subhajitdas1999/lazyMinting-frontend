import { useContext, useEffect, useState } from "react";
import { userContext } from "./App";
import AxiosInstance from "./axoisInstancs";
import NFTCard from "./NFTCard";

const Home = () => {

  const [nfts, setNfts] = useState([]);
  useEffect(() => {
    AxiosInstance("api/nft/allNfts")
      .then((response) => {
          setNfts(response.data.data.nftCollections);
        })
      .catch((err) => alert(err.message));

  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <div className="allNFTS">
          {nfts?nfts.map((nftDetail,idx)=> <NFTCard key={idx} NFTArt= {nftDetail}/>):<h1>Loading...</h1>}
      </div>
    </div>
  );
};

export default Home;
