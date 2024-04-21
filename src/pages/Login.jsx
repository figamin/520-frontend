// client/src/pages/Login.jsx

import React from "react";
import Navbar from "../components/Navbar";
import "../styles/login.scss";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../authContext";

function Login({type}) {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const urls = {
    "admin": "http://localhost:7700/api/admin/login",
    "user": "http://localhost:7700/api/users/login"
  }

  const landings = {
    "admin": "/admin/dashboard",
    "user": "/home"
  }

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(urls[type], credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate(landings[type]);
    } catch (err) {
      if (err.response && err.response.data) {
        // If error response and data exist, dispatch LOGIN_FAILURE with error message
        dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
      } else {
        // If no error response or data, dispatch generic error message
        dispatch({ type: "LOGIN_FAILURE", payload: "An error occurred while logging in" });
      }
    }
  };


  return (
    <div className="login">
      <Navbar type={type}/>
      <div className="loginCard">
        <div className="center">
          <h1>Welcome back {type}!</h1>
          <form>
            <div className="txt_field">
              <input
                type="text"
                placeholder="username"
                id="username"
                onChange={handleChange}
                className="lInput"
              />
            </div>
            <div className="txt_field">
              <input
                type="password"
                placeholder="password"
                id="password"
                onChange={handleChange}
                className="lInput"
              />
            </div>
            <div className="login_button">
              <button className="button" onClick={handleClick}>
                Login
              </button>
            </div>
            <div className="signup_link">
              <p>
                Not registered? <Link to={type==="admin"? "/adminRegister" : "/userRegister"}>Register</Link>
              </p>
            </div>
          </form>
 
        </div>
      </div>
    </div>
  );
}

export default Login;
