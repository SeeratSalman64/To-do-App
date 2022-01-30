import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import UserContext from './context/UserContext';
import Axios from 'axios';
import Landing from './components/layout/Landing';
import Header from './components/layout/Navbar';
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

function App() {

  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await Axios.post("http://localhost:5000/users/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } });
      if (tokenRes.data) {
        const userRes = await Axios.get("http://localhost:5000/users/", { headers: { "x-auth-token": token } });
        setUserData({
          token,
          user: userRes.data
        });
      }
    };
    checkLoggedIn();
  }, [])

  return (
    <UserContext.Provider value={{ userData, setUserData }} >
      <div className="App">
        <Header />
        <Router>
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
          </Switch>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
