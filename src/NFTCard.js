import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import defaultImg from "./images/default.jpg";
const NFTCard = (props) => {
  const [nftCompleteData, setNFTCompleteData] = useState({db:props});
  useEffect(() => {
    fetch(props.NFTArt.artLink)
      .then((response) => response.json())
      .then((data) => {
        setNFTCompleteData((prev) => {
          return {
            ...prev,
            ipfs: data,
          };
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  }, []);
  return (
    <div className="nftCard">
      {nftCompleteData.ipfs ? (
        <Link
          to={`/nft/${nftCompleteData.db.NFTArt.tokenId}`}
          state={nftCompleteData}
        >
          <div className="nftCard_loaded">
            <div className="cardImage" style={{width:"200px", height:"200px"}}>
              <img
                src={`https://ipfs.moralis.io:2053/ipfs/${
                  nftCompleteData.ipfs.imageURI.split("//")[1]
                }`}
                alt="Nft art"
              style={{width:"200px",height:"200px"}}/>
            </div>
            <div className="cardDescription">
              <p className="nftArtDescription">
                {nftCompleteData.db.NFTArt.NFTArtDescription}
              </p>
              {nftCompleteData.db.NFTArt.isTokenOnchain ? (
                <p>On chain Token</p>
              ) : (
                <p>Off chain Token</p>
              )}
              {nftCompleteData.db.NFTArt.isForSale ? (
                <div>
                  <span>{nftCompleteData.db.NFTArt.sellPrice} Ether</span>
                </div>
              ) : (
                <p>Not for sale yet</p>
              )}
            </div>
          </div>
        </Link>
      ) : (
        <div className="nftCard_loaded">
          <div className="cardImage">
            <img src={defaultImg} alt="default img" />
          </div>
          <div className="cardDescription">
            <p className="nftArtDescription">
              {nftCompleteData.db.NFTArt.NFTArtDescription}
            </p>
            {nftCompleteData.db.NFTArt.isTokenOnchain ? (
              <p>On chain Token</p>
            ) : (
              <p>Off chain Token</p>
            )}
            {nftCompleteData.db.NFTArt.isForSale ? (
              <div>
                <span>{nftCompleteData.db.NFTArt.sellPrice} Ether</span>
              </div>
            ) : (
              <p>Not for sale yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTCard;
