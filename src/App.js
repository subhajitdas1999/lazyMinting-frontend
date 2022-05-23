import { createContext, useEffect, useState } from "react";
import Header from "./Header";
import Home from "./Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AxiosInstance from "./axoisInstancs.js";
import NFTDetails from "./NFTDetails";
import MyAccount from "./MyAccount";
import MyNFTs from "./MyNFTs";

const userContext = createContext();
const authContext = createContext();
function App() {
  const [user, setUser] = useState({});
  const [userAuthData, setUserAuthData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    isUserLoggedIn: false,
  });

  useEffect(() => {
    AxiosInstance.post("api/users/isLoggedIn", {})
      .then((response) => setUser(response.data.data.user))
      .catch((err) => {});
  }, []);

  const handleAuthDataChange = async (e) => {
    setUserAuthData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.post("api/users/signup", {
        name: userAuthData.name,
        email: userAuthData.email,
        password: userAuthData.password,
        passwordConfirm: userAuthData.passwordConfirm,
      });

      setUser(response.data.data.user);
    } catch (err) {
      if (err.response.data) {
        alert(err.response.data.message);
      } else {
        alert("something went wrong");
      }
      console.log(err);
    }
  };

  const handleLogInSubmit = async (e) => {
    console.log("Enter");
    e.preventDefault();
    try {
      const response = await AxiosInstance.post("api/users/login", {
        email: userAuthData.email,
        password: userAuthData.password,
      });

      setUser(response.data.data.user);

      // console.log(response.data.data);
    } catch (err) {
      if (err.response.data) {
        alert(err.response.data.message);
      } else {
        alert("something went wrong");
      }
      console.log(err);
    }
  };

  const handleLogOut = async () => {
    const response = await AxiosInstance.post("api/users/logout");

    setUser({});
  };
  return (
    <Router>
      <div className="App">
        <userContext.Provider value={{ userDetails: [user, setUser] }}>
          <authContext.Provider
            value={{
              authHandlers: [
                handleAuthDataChange,
                handleSignupSubmit,
                handleLogInSubmit,
                handleLogOut,
              ],
            }}
          >
            <Header />
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/nft/:tokenId" exact element={<NFTDetails />} />
              <Route path="/redirect" element={<Navigate to={"/"} />} />
              <Route path="/myAccount" exact element={<MyAccount />} />
              <Route path="/myNFTS" exact element={<MyNFTs />} />
            </Routes>
          </authContext.Provider>
        </userContext.Provider>
      </div>
    </Router>
  );
}

export { App, userContext, authContext };
