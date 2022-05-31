import React from "react";
import { IoCloseOutline } from "react-icons/io5";

const Modal = ({ show, handleClose, children }) => {
  return (
    <div
      className={`bg-black bg-opacity-50 
      justify-center items-center ${show ? "flex" : "hidden"}
      fixed top-0 left-0 h-full w-full
      `}
    >
      <div className="bg-white min-w-[20rem] min-h-[20rem] relative rounded-md">
        <IoCloseOutline
          className="absolute top-0 right-0 BaseButton p-0 rounded-[0] hover:cursor-pointer"
          size={32}
          color="#000"
          onClick={handleClose}
        />
        {show && children}
      </div>
    </div>
  );
}

const LoadingModal = ({ show, children }) => {
    return (
      <div
        className={`bg-black bg-opacity-50 
        justify-center items-center ${show ? "flex" : "hidden"}
        fixed top-0 left-0 h-full w-full
        `}
      >
        <div className="bg-white w-72 h-72 relative rounded-md">

          {show && children}
        </div>
      </div>
    );
  }
export {Modal,LoadingModal}