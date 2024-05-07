import React, { useState } from 'react';
import './SignIn.css'; // Importation de la feuille de style CSS
import ServerService from '../../services/ServerService';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  let history = useHistory()

  const navigate = useNavigate();


  const handleSubmit = () => {

    ServerService.sendLogin(username, password, () => {
      history.push('/home')
      navigate("/home");

    }, () => {

    })

  };

  return (
    <div className="signup-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Email:</label>
          <input
            type="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
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