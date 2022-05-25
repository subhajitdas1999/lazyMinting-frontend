import { useContext, } from "react";
import defaultProfileIng from "./images/defaultProfile.jpg";
import { userContext, authContext } from "./App.js";
import { Link } from "react-router-dom";

const Header = () => {
  const [user] = useContext(userContext).userDetails;
  const [
    handleAuthDataChange,
    handleSignupSubmit,
    handleLogInSubmit,
    
  ] = useContext(authContext).authHandlers;

  return (
    <div className="Header">
      <h1>Header</h1>
      {!user._id ? (
        <div>
          <div className="signup">
            <form onSubmit={handleSignupSubmit}>
              <input
                type="text"
                placeholder="name"
                required
                name="name"
                onChange={handleAuthDataChange}
              />
              <br />
              <input
                type="email"
                placeholder="email"
                required
                name="email"
                onChange={handleAuthDataChange}
              />
              <br />
              <input
                type="password"
                placeholder="password"
                required
                name="password"
                onChange={handleAuthDataChange}
              />
              <br />
              <input
                type="password"
                placeholder="confirm password"
                required
                name="passwordConfirm"
                onChange={handleAuthDataChange}
              />
              <br />
              <button type="submit">sign up</button>
            </form>
          </div>
          <div className="login">
            <form onSubmit={handleLogInSubmit}>
              <input
                type="email"
                placeholder="email"
                required
                name="email"
                onChange={handleAuthDataChange}
              />
              <br />
              <input
                type="password"
                placeholder="password"
                required
                name="password"
                onChange={handleAuthDataChange}
              />
              <br />
              <button type="submit">logIn</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="myAccount">
          <img src={defaultProfileIng} alt="" />
          <Link to={"/myAccount"}>
            <p>{user.name}</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
