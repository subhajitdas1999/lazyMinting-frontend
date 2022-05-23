import { useContext, useEffect, useState } from "react";
import { userContext } from "./App";
import AxiosInstance from "./axoisInstancs.js";
import NFTCard from "./NFTCard";

const MyNFTs = () =>{
    const [user] = useContext(userContext).userDetails;
    const [nfts, setNfts] = useState([]);
  useEffect(() => {
    AxiosInstance("api/nft/myNfts")
      .then((response) => {
          setNfts(response.data.data.nftCollections);
        })
      .catch((err) => alert(err.message));

  }, []);
    return (
        <div className="myNFTs">
            <h1>{user.name} NFTS</h1>
            <div className="allNFTs">
            {nfts?nfts.map((nftDetail,idx)=> <NFTCard key={idx} NFTArt= {nftDetail}/>):<h1>Loading...</h1>}
            </div>
        </div>
    );
}

export default MyNFTs;