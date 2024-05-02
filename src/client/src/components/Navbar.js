import React, { useState, useEffect } from 'react';
import { Button } from './ButtonLogin';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  const handleValidate = () => {
    fetch('http://localhost:3001/api/v1/login_spotify', {
      method: 'GET',
      // mode: 'no-cors'
    })
      .then(response => {
        if (!response.ok) {
          console.log("Failed to connect");
        }
        // Comme on utilise no-cors le response status sera toujours 0, donc impossible de savoir si ça marche..
        //console.log(response.status);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  // const handleValidate = () => {
  //   const client_id = 'b6df1ac233ea4d359790c9a95ccb1ebb';
  //   const redirect_uri = 'http://localhost:3001/authCredential';
  //   const state = 'OzeSpn73t00EsMKwKdfr';
  //   const scope = 'user-read-private user-modify-playback-state user-read-playback-state playlist-read-collaborative playlist-read-private';

  //   // Redirect user to Spotify authorization page
  //   window.location.href = 'https://accounts.spotify.com/authorize?' +
  //     new URLSearchParams({
  //       response_type: 'code',
  //       client_id,
  //       scope,
  //       redirect_uri,
  //       state
  //     });
  // };


  // This endpoint is hosted on a different domain (accounts.spotify.com) than your frontend code. 
  //When your frontend code makes a request to this endpoint, the browser checks for CORS headers in the response.
  // If the Spotify server does not include the necessary CORS headers to allow requests from your domain, 
  //the browser will block the request and throw a CORS error.


  // const originalPageURL = window.location.href;

  // const handleValidate = () => {
  //   const client_id = 'b6df1ac233ea4d359790c9a95ccb1ebb';
  //   const redirect_uri = 'http://localhost:3001/authCredential';
  //   const state = 'OzeSpn73t00EsMKwKdfr';
  //   const scope = 'user-read-private user-modify-playback-state user-read-playback-state playlist-read-collaborative playlist-read-private';

  //   fetch('https://accounts.spotify.com/authorize?',
  //     new URLSearchParams({
  //       response_type: 'code',
  //       client_id,
  //       scope,
  //       redirect_uri,
  //       state
  //     }))
  //   .then(response => {
  //     // Check if the response indicates a redirection
  //     if (response.redirected) {
  //       // Redirect the user to the Spotify authorization page
  //       window.location.href = response.url;
  //     } else {
  //       // Handle other responses if needed
  //     }
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });
  // };

  // const handleValidate = () => { 
  //   console.log("hello");

  //   // Send API request using fetch
  //   fetch('http://localhost:3001/api/v1/login_spotify', {
  //     method: 'GET',
  //     // method: 'POST',
  //     headers: {
  //        'Content-Type': 'application/json',
  //        'Access-Control-Allow-Origin':'https://accounts.spotify.com/authorize'
  //     },
  //     // body: JSON.stringify(payload)
  //   })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('Failed to send API request');
  //     }
  //     return response.json();
  //   })
  //   .then(data => {
  //     // Handle successful response
  //     console.log('API request successful:', data);
  //   })
  //   .catch(error => {
  //     // Handle error
  //     console.error('Error sending API request:', error);
  //   });
  // };

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            TRVL
            <i class='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/services'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Services
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/products'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Products
              </Link>
            </li>

            <li>
              <Link
                to='/sign-up'
                className='nav-links-mobile'
                onClick={closeMobileMenu}
              >
                Sign Up
              </Link>
            </li>
          </ul>
          {/* button && <Button buttonStyle='btn--outline' onClick={handleValidate}>SIGN UP</Button> */}
          {button && <a target="_blank" href="http://localhost:3001/api/v1/login_spotify" buttonStyle='btn--outline' >SIGN UP</a>}
        </div>
      </nav>
    </>
  );
}

export default Navbar;

