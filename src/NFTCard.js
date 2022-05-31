import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEthereum } from "react-icons/fa";
import defaultImg from "./images/default.jpg";
const NFTCard = (props) => {
  const [nftCompleteData, setNFTCompleteData] = useState({ db: props });
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
    <div className="w-72 m-5">
      {nftCompleteData.ipfs ? (
        <Link
          to={`/nft/${nftCompleteData.db.NFTArt.tokenId}`}
          state={nftCompleteData}
        >
          <div className="nftCard_loaded">
            <div className="cardImage h-72">
              <img
                src={`https://ipfs.moralis.io:2053/ipfs/${
                  nftCompleteData.ipfs.imageURI.split("//")[1]
                }`}
                alt="Nft art"
                style={{ width: "100%", height: "100%" ,objectFit:"cover",borderRadius:"0.3rem"}}
              />
            </div>
            <div className="cardDescription border-2 rounded border-slate-200 pb-2">
              <p className="nftArtName font-bold">{nftCompleteData.db.NFTArt.artName}</p>
              {nftCompleteData.db.NFTArt.isTokenOnchain ? (
                <p>On Chain</p>
              ) : (
                <div>
                  <p className="">Off Chain</p>
                </div>
              )}
              {nftCompleteData.db.NFTArt.isForSale ? (
                <div>
                  <p className=" flex items-center justify-end font-medium text-xl">
                    {nftCompleteData.db.NFTArt.sellPrice} <FaEthereum />
                  </p>
                </div>
              ) : (
                <p className=" w-fit mx-auto border-b-2 uppercase border-black">Not for sale yet</p>
              )}
            </div>
          </div>
        </Link>
      ) : (
        <div className="nft_notLoaded">
          <div className="cardImage">
            <img src={defaultImg} alt="default img" />
          </div>
          <div className="cardDescription">
            <p className="nftArtDescription">
              {nftCompleteData.db.NFTArt.artDescription}
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
