import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext, authContext } from "./App";
import AxiosInstance from "./axoisInstancs.js";
import defaultProfileIng from "./images/defaultProfile.jpg";
import catchAsync from "./utils/catchAsync";

const MyAccount = () => {
  const [file, setFile] = useState({
    nftDescription: "",
    nftFile: "",
  });
  const [user] = useContext(userContext).userDetails;
  const [
    handleAuthDataChange,
    handleSignupSubmit,
    handleLogInSubmit,
    handleLogOut,
  ] = useContext(authContext).authHandlers;
  const nav = useNavigate();

  const handleFileChange = (e) => {
    e.target.name === "nftFile"
      ? setFile((prev) => {
          return {
            ...prev,
            nftFile: e.target.files[0],
          };
        })
      : setFile((prev) => {
          return {
            ...prev,
            nftDescription: e.target.value,
          };
        });
  };
  const handleUploadNFT = catchAsync(async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", file.nftDescription);
    formData.append("NFTImage", file.nftFile);

    const res = await AxiosInstance.post("api/nft/uploadNFT", formData);

    setFile({
      nftDescription: "",
      nftFile: "",
    });

    nav("/myNFTs");
  });

  return (
    <div className="myAccount">
      <div className="myAccount_leftPart">
        <img src={defaultProfileIng} alt="" />
      </div>
      <div className="myAccount_rightPart">
        <p>{user.name}</p>
        <p>{user.email}</p>
        <div className="uploadForm">
          <form onSubmit={handleUploadNFT}>
            <input
              type="text"
              name="nftDescription"
              required
              value={file.nftDescription}
              onChange={handleFileChange}
            />
            <input
              type="file"
              name="nftFile"
              required
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
            />
            <button type="submit">Upload NFT</button>
          </form>
        </div>

        <Link to={"/myNFTs"}>Show MY NFTS</Link>
        <div className="logOut">
          <Link to={"/redirect"}>
            <button onClick={handleLogOut}>Log Out</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
