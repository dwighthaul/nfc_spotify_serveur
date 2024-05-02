import React, { useState } from 'react';
import ApiDropdown from './ApiDropDown';
import Dropdown from './DropDown';
import ValidateButton from './ValidateButton'
import './styles.css'; // Import CSS styles
import Cookies from 'js-cookie'

const MainComponent = () => {
  const [selectedApiValue, setSelectedApiValue] = useState('');
  const [selectedHardcodedValue, setSelectedHardcodedValue] = useState('');


  const setSession = () => {
    console.log('setSession')
    // Send API request using fetch
    fetch('http://localhost:3001/setSession', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('response.headers')
        console.log(response.headers)

        console.log('response.headers.getSetCookie()')
        console.log(response.headers.getSetCookie())
        var tt = Cookies.set('connect', 'test')
        console.log('tt', tt)


        var connect = Cookies.get()
        console.log('connect', connect)


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
    console.log('getSession')
    var connect = Cookies.get('connect')
    console.log('connect')
    console.log(connect)

    // Send API request using fetch
    fetch('http://localhost:3001/getSession', {
      method: 'GET',
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


  const handleValidate = () => {
    // Construct payload
    const payload = {
      apiValue: selectedApiValue,
      hardcodedValue: selectedHardcodedValue
    };
    console.log("hello");

    // Send API request using fetch
    fetch('http://localhost:3001/api/v1/playlists/', {
      method: 'GET',
      // method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      // body: JSON.stringify(payload)
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
      });
  };

  return (
    <div className="container">
      <div className="dropdowns-wrapper">

        <button
          title="get Session"
          color="#000000"
          onClick={() => getSession()}
        />

        <button
          title="Set Session"
          color="#000000"
          onClick={() => setSession()}
        />
        <button
          title="Press me"
          color="#000000"
          onClick={() => handleValidate()}
        />
        <ApiDropdown onChange={e => setSelectedApiValue(e.target.value)} />
        <Dropdown onChange={e => setSelectedHardcodedValue(e.target.value)} />
      </div>
    </div>
  );
};
{/* <div className="validate-wrapper">
<ValidateButton onClick={handleValidate} />
</div>
 */}

export default MainComponent;