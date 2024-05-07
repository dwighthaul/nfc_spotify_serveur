import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import './AppCss.css';

import Navbar from './components/Navbar';
import Home from './components/pages/Home/Home.js';
import Page404 from './components/pages/Page404/Page404.js';
import Playlists from './components/pages/Playlists/Playlists.js';
import SignIn from './components/pages/SignIn/SignIn.js';

export default class App extends React.Component {



  render() {
    return (
      <BrowserRouter>
        <Navbar />
        <div className='app'>
          <div className='app-container'>
            <Routes>
              <Route path='/' exact element={<Home />} />
              <Route path='/home' exact element={<Home />} />
              <Route path='/playlist' exact element={<Playlists />} />
              <Route path='/sign-in' element={<SignIn />} />
              <Route path='/404' element={<Page404 />} />
              <Route path='*' element={<Page404 />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    );
  }

}

