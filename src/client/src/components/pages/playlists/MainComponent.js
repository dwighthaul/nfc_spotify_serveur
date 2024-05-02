import React, { useState } from 'react';
import ApiDropdown from './ApiDropDown';
import Dropdown from './DropDown';
import './styles.css'; // Import CSS styles

const MainComponent = () => {
  const [selectedApiValue, setSelectedApiValue] = useState('');
  const [selectedHardcodedValue, setSelectedHardcodedValue] = useState('');


  const setSession = () => {
    console.log('setSession')
    // Send API request using fetch
    fetch('http://localhost:3001/setSession', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => {


        if (!response.ok) {
          throw new Error('Failed to send API request');
        }
        return response.json();
      })
      .then(data => {
        console.log('IIIIII')
        console.log(data)

        //Cookies.set('sessionCookie', JSON.stringify(data), { expires: 1 });

        // Handle successful response
        console.log('API request successful:', data.Cookies);
      })
      .catch(error => {
        // Handle error
        console.error('Error sending API request:', error);
      })
  }

  const getSession = () => {

    // Send API request using fetch
    fetch('http://localhost:3001/getSession', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send API request');
        }
        return response.json();
      })
      .then(data => {
        // Handle successful response
        console.log('API request successful:', data);
      })
      .catch(error => {
        // Handle error
        console.error('Error sending API request:', error);
      })
  }


  const lancer = () => {
    // Construct payload
    const payload = {
      apiValue: ApiDropdown,
      hardcodedValue: selectedHardcodedValue
    };
    console.log(payload);

    // Send API request using fetch
    fetch('http://localhost:3001/api/v1/launch_song/?id_device=' + selectedHardcodedValue + '&playlist_uri=' + selectedApiValue, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send API request');
        }

      })
      .then(data => {

      })
      .catch(error => {
        // Handle error
        console.error('Error sending API request:', error);
      });
  };


  return (

    <div className="container">
      <div className="dropdowns-wrapper">
        <p>Playlist : {selectedApiValue}</p>
        <br></br>
        <p>Device : {selectedHardcodedValue}</p>

        <button
          title="get Session"
          color="#000000"
          onClick={() => getSession()}
        >Get Session</button>


        <button
          title="Set Session"
          color="#000000"
          onClick={() => setSession()}
        >Set Session</button>
        <ApiDropdown onChange={setSelectedApiValue} />
        <Dropdown onChange={setSelectedHardcodedValue} />
        <button
          title="Press me"
          color="#000000"
          onClick={() => lancer()}
        >Lancer</button>
      </div>
    </div>
  );
};

export default MainComponent;