import React from 'react';
import { Route, BrowserRouter, Switch, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/pages/Home/Home.js';
import SignIn from './components/pages/SignIn/SignIn.js';
import Playlists from './components/pages/Playlists/Playlists.js';
import Page404 from './components/pages/Page404/Page404.js';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className='app'>
        <div className='app-container'>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/home' exact component={Home} />
            <Route path='/playlist' exact component={Playlists} />
            <Route path='/sign-in' component={SignIn} />
            <Route path='/404' component={Page404} />
            <Route path='*' component={Page404} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
