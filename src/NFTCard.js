import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import defaultImg from "./images/default.jpg";
const NFTCard = (props) => {
  const [NftIPFSDetails, setNftIPFSDetails] = useState({});
  useEffect(() => {
    fetch(props.NFTArt.artLink)
      .then((response) => response.json())
      .then((data) => setNftIPFSDetails(data))
      .catch((err) => {
        alert(err.message);
      });
  }, []);
  return (
      
      <Link to={`/nft/${props.NFTArt.tokenId}`} state={props}>
    <div className="nftCard">
      <div className="cardImage">
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
      <div className="cardDescription">
        <p className="nftArtDescription">{props.NFTArt.NFTArtDescription}</p>
        {props.NFTArt.isTokenOnchain ? (
          <p>On chain Token</p>
        ) : (
          <p>Off chain Token</p>
        )}
        {props.NFTArt.isForSale ? (
          <div>
            <span>{props.NFTArt.sellPrice} Ether</span>
          </div>
        ) : (
          <p>Not for sale yet</p>
        )}

        
      </div>
    </div>
    </Link>
  );
};

export default NFTCard;
