// ApiDropdown.js
import React, { useState, useEffect } from 'react';

const ApiDropdown = (props) => {
  const [options, setOptions] = useState([]);

  var handleChange = (e) => {
    console.log(e.target.value)
    props.onChange(e.target.value)
  }
  useEffect(() => {
    console.log('API dropdown loading')
    // Make API request to fetch dropdown options
    fetch('http://localhost:3001/api/v1/playlists', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch dropdown options');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.items) {
          setOptions(data.items);
        }

      })
      .catch(error => {
        console.error('Error fetching dropdown options:', error);
      });
  }, []);

  return (
    <select onChange={handleChange}>
      {options.map(option => (
        <option key={option.uri} value={option.uri}>{option.name}</option>
      ))}
    </select>
  );
};

export default ApiDropdown;