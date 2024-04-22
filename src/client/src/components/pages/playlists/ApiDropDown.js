// ApiDropdown.js
import React, { useState, useEffect } from 'react';

const ApiDropdown = () => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Make API request to fetch dropdown options
    fetch('http://localhost:3001/api/v1/playlists')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch dropdown options');
        }
        return response.json();
      })
      .then(data => {
        setOptions(data);
      })
      .catch(error => {
        console.error('Error fetching dropdown options:', error);
      });
  }, []);

  return (
    <select>
      {options.map(option => (
        <option key={option.id} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
};

export default ApiDropdown;