import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import ServerService from './services/ServerService';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const [username, setUsername] = useState('');

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  const getDataFromUser = () => {
    ServerService.fetchUserInfos((data) => {

      if (data?.user?.username) {
        console.log(data)
        setUsername(data?.user?.username)
      }

    }, (error) => {

    });
  };

  useEffect(() => {
    showButton();

    getDataFromUser();


  }, []);

  window.addEventListener('resize', showButton);


  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            TRVL
            <i className='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}> Home </Link>
            </li>
            <li className='nav-item'>
              <Link to='/playlist' className='nav-links' onClick={closeMobileMenu}> Playlist</Link>
            </li>
            <li>
              <Link to='/sign-in' className='nav-links' onClick={closeMobileMenu}> Sign In</Link>
            </li>
            <li>
              <p className='nav-links' > {username}</p>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

