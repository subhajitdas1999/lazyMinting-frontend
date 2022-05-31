import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext, authContext } from "./App";
import AxiosInstance from "./axoisInstancs.js";
import defaultProfileImg from "./images/defaultProfile.jpg";
import uploadingLoader from "./images/uploading.gif";
import { HiOutlineExternalLink } from "react-icons/hi";
import { LoadingModal } from "./Modal";
import catchAsync from "./utils/catchAsync";

const MyAccount = () => {
  const [uploadModal, setUploadModal] = useState(false);
  const [file, setFile] = useState({
    nftName: "",
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
            [e.target.name]: e.target.value,
          };
        });
  };
  const handleUploadNFT = catchAsync(
    async (e) => {
      e.preventDefault();
      setUploadModal(true);
      const formData = new FormData();
      formData.append("artName", file.nftName);
      formData.append("description", file.nftDescription);
      formData.append("NFTImage", file.nftFile);
      const res = await AxiosInstance.post("api/nft/uploadNFT", formData, {
        withCredentials: true,
      });

      setFile({
        nftName: "",
        nftDescription: "",
        nftFile: "",
      });

      setUploadModal(false);


      nav("/myNFTs",{state:"uploadSuccessFull"});
    },
    () => setUploadModal(false)
  );

  return (
    <div className="myAccount mx-4">
      <div className="myAccount_image w-72 h-72 mx-auto my-6">
        <img
          src={defaultProfileImg}
          alt=""
          style={{ width: "100%", height: "100%", borderRadius: "50%" }}
        />
      </div>
      <div className="myAccount_details">
        <p className="w-fit text-3xl uppercase mx-auto my-5">{user.name}</p>
        <p className="w-fit mx-auto text-gray-500 pb-2 border-b-4 border-black">
          Email: {user.email}
        </p>
        <Link to={"/myNFTs"}>
          <p className="w-fit text-xl mx-auto my-5 flex items-center text-blue-900">
            Show MY NFT's <HiOutlineExternalLink />
          </p>
        </Link>
      </div>

      <div className="block p-6 rounded-lg w-fit mx-auto my-7 bg-white max-w-sm">
        <p className="w-fit mx-auto text-2xl mb-3">Upload Your NFT</p>
        <form onSubmit={handleUploadNFT}>
          <div className="form-group mb-6">
            <label
              htmlFor="exampleInputName2"
              className="form-label inline-block mb-2 text-gray-700"
            >
              NFT Name
            </label>
            <input
              type="text"
              className="form-control
        block
        w-full
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
              id="exampleInputName2"
              aria-describedby="emailHelp"
              name="nftName"
              value={file.nftName}
              onChange={handleFileChange}
              placeholder="NFT Name"
              required
            />
          </div>

          <div className="form-group mb-6">
            <label
              htmlFor="exampleFormControlTextarea1"
              className="form-label inline-block mb-2 text-gray-700"
            >
              NFT description
            </label>
            <textarea
              className="
        form-control
        block
        w-full
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
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
              id="exampleFormControlTextarea1"
              rows="3"
              placeholder="Your message"
              name="nftDescription"
              value={file.nftDescription}
              onChange={handleFileChange}
              required
            ></textarea>
          </div>

          <div className="form-group mb-6">
            <label
              htmlFor="formFile"
              className="form-label inline-block mb-2 text-gray-700"
            >
              NFT File
            </label>
            <input
              className="form-control
    block
    w-full
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
              type="file"
              id="formFile"
              name="nftFile"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              required
            />
          </div>

          <button
            type="submit"
            className="
      w-full
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
            upload nft
          </button>
        </form>
      </div>
      <LoadingModal show={uploadModal}>
        <div
          className="flex items-center mt-3 flex-col justify-center"
          style={{ width: "100%", height: "100%" }}
        >
          <p className="text-2xl mb-2 font-bold">Uploading NFT ...</p>
          <div className="">
            <img src={uploadingLoader} alt="" />
          </div>
        </div>
      </LoadingModal>

      
    </div>
  );
};

export default MyAccount;
