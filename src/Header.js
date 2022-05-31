import { useContext, useState } from "react";
import defaultProfileIng from "./images/defaultProfile.jpg";
import { userContext, authContext } from "./App.js";
import { Link, useNavigate } from "react-router-dom";

import { Modal } from "./Modal";
import catchAsync from "./utils/catchAsync";
import AuthLoader from "./images/authLoader.gif";

const Header = () => {
  const [authLoading, setAuthLoading] = useState(false);
  const [modal, setModal] = useState({
    signIn: false,
    signUp: false,
  });
  const [user, setUser] = useContext(userContext).userDetails;
  const [
    handleAuthDataChange,
    handleSignupSubmit,
    handleLogInSubmit,
    handleLogOut,
  ] = useContext(authContext).authHandlers;

  const nav = useNavigate();

  const handleModalOpen = (e) => {
    setAuthLoading(false)
    setModal({
      signIn: false,
      signUp: false,
      [e.target.name]: true,
    });
  };

  const handleModalClose = () => {
    setModal({
      signIn: false,
      signUp: false,
    });
  };

  const handleSignUpForm = catchAsync(async (e) => {
    setAuthLoading(true)
    await handleSignupSubmit(e);
    setAuthLoading(false)
    handleModalClose();
    nav("/");
  }, handleModalClose);

  const handleSignInForm = catchAsync(async (e) => {
    setAuthLoading(true)
    await handleLogInSubmit(e);
    setAuthLoading(false)
    handleModalClose();
    nav("/");
  }, handleModalClose);

  const handleLogOutFrom = catchAsync(async (e) => {
    await handleLogOut(e);
    nav("/");
  });
  return (
    <div className=" bg-blue-800 px-2 py-2 flex justify-between items-center">
      <div className="left text-3xl text-white border-4 p-1 ml-4">
        <Link to="/">Home</Link>{" "}
      </div>
      {user._id ? (
        <div className="flex items-center px-2 mr-4">
          <Link to="/myAccount">
            <img
              src={defaultProfileIng}
              alt=""
              className=" w-8 h-8 rounded-full mr-4 hover:cursor-pointer"
            />
          </Link>

          <button onClick={handleLogOutFrom} className="text-white">
            Log Out
          </button>
        </div>
      ) : (
        <div className="mr-4">
          <button
            className="mr-8 px-3 py-1 border rounded-sm text-white"
            name="signIn"
            onClick={handleModalOpen}
          >
            Sign in
          </button>
          <button
            className="border px-3 py-1  rounded-sm text-white"
            name="signUp"
            onClick={handleModalOpen}
          >
            Signup
          </button>
        </div>
      )}

      {/* this modal is for sign in / Log in */}
      <Modal show={modal.signIn} handleClose={handleModalClose}>
        <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
          <form onSubmit={handleSignInForm}>
            <div className="form-group mb-6">
              <label
                htmlFor="exampleInputEmail2"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
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
                id="exampleInputEmail2"
                aria-describedby="emailHelp"
                name="email"
                onChange={handleAuthDataChange}
                placeholder="Enter email"
                autoComplete="true"
                required
              />
            </div>
            <div className="form-group mb-6">
              <label
                htmlFor="exampleInputPassword2"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                className="form-control block
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
                id="exampleInputPassword2"
                name="password"
                onChange={handleAuthDataChange}
                placeholder="Password"
                autoComplete="true"
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
              {authLoading ?  <div
                className="mx-auto"
                style={{ width: "20px", height: "20px" }}
              >
                <img src={AuthLoader} alt="" />
              </div> : "sign in"}
            </button>
          </form>
          <p className="text-gray-800 mt-6 text-center">
            Not a member?{" "}
            <button
              className="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out"
              name="signUp"
              onClick={handleModalOpen}
            >
              Sign up
            </button>
          </p>
        </div>
      </Modal>
      {/* *************************************************************************************************************** */}
      {/* modal for sign up */}
      <Modal show={modal.signUp} handleClose={handleModalClose}>
        <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
          <form onSubmit={handleSignUpForm}>
            <div className="form-group mb-6">
              <label
                htmlFor="exampleInputName2"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Name
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
                name="name"
                onChange={handleAuthDataChange}
                placeholder="Name"
                autoComplete="true"
                required
              />
            </div>
            <div className="form-group mb-6">
              <label
                htmlFor="exampleInputEmail2"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
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
                id="exampleInputEmail2"
                aria-describedby="emailHelp"
                name="email"
                onChange={handleAuthDataChange}
                placeholder="email"
                autoComplete="true"
                required
              />
            </div>
            <div className="form-group mb-6">
              <label
                htmlFor="exampleInputPassword2"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                className="form-control block
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
                id="exampleInputPassword2"
                name="password"
                onChange={handleAuthDataChange}
                placeholder="Password"
                autoComplete="true"
                required
              />
            </div>

            <div className="form-group mb-6">
              <label
                htmlFor="exampleInputPasswordConfirm2"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Password confirm
              </label>
              <input
                type="password"
                className="form-control block
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
                id="exampleInputPasswordConfirm2"
                name="passwordConfirm"
                onChange={handleAuthDataChange}
                placeholder="Password confirm"
                autoComplete="true"
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
            {authLoading ?  <div
                className="mx-auto"
                style={{ width: "20px", height: "20px" }}
              >
                <img src={AuthLoader} alt="" />
              </div> : "sign up"}
            </button>
          </form>
          <p className="text-gray-800 mt-6 text-center">
            already a member?{" "}
            <button
              className="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out"
              name="signIn"
              onClick={handleModalOpen}
            >
              Sign in
            </button>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
