import React, { useState, useEffect } from 'react';
import ServerService from '../../services/ServerService';

function Playlists() {
  const [playlists, setPlaylist] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedPlaylist, setselectedPlaylist] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [button, setButton] = useState(true);


  const getPlaylist = () => {
    ServerService.fetchPlaylists((data) => {

      if (data && data.items) {
        setPlaylist(data.items);
        setLoading(false);

      } else {
        setError(error);
        setLoading(false);

      }

    }, (error) => {

      setError(error);
      setLoading(false);
    });
  }


  const lancer = () => {

    ServerService.lancerPlaylist(selectedDevice, selectedPlaylist, (result) => {
      console.log(result)
    }, (error) => {
      console.log(error)
    })

  }
  const getDevices = () => {
    ServerService.fetchDevices((data) => {

      if (data && data.devices) {
        setDevices(data.devices);
        setLoading(false);

      } else {
        setError(error);
        setLoading(false);
      }

    }, (error) => {

      setError(error);
      setLoading(false);
    });
  }


  useEffect(() => {
    getPlaylist();
    getDevices();
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      {button && <a target="_blank" rel="noreferrer" href="http://localhost:3001/api/v1/login_spotify" buttonstyle='btn--outline' >SIGN UP</a>}

      <select onChange={(e) => setselectedPlaylist(e.target.value)}>
        <option value=""></option>
        {playlists.map(option => (
          <option value={option.uri}>{option.name}</option>
        ))}
      </select>

      <select onChange={(e) => setSelectedDevice(e.target.value)}>
        <option value=""></option>
        {devices.map(option => (
          <option value={option.id}>{option.name} - {option.type}</option>
        ))}
      </select>

      <button
        title="Lancer"
        color="#000000"
        onClick={() => lancer()}
      >Lancer</button>
    </div>
  );
}

export default Playlists;