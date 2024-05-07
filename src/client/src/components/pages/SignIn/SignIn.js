import React, { useState } from 'react';
import './SignIn.css'; // Importation de la feuille de style CSS
import ServerService from '../../services/ServerService';
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();
    ServerService.sendLogin(username, password, () => {
      console.log("Login OK")
      navigate("/home");

    }, () => {
      console.log("Login OK")

    })

  };

  return (
    <div className="signup-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Email:</label><br />
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label><br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign in</button>
      </form>
      <p>Pas encore de compte ? <Link to='/sing-on' >Creer</Link></p>

    </div>
  );
};

export default SignIn;