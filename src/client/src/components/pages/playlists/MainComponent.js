import React, { useState } from 'react';
import ApiDropdown from './ApiDropDown';
import Dropdown from './DropDown';
import ValidateButton from './ValidateButton'
import './styles.css'; // Import CSS styles

const MainComponent = () => {
    const [selectedApiValue, setSelectedApiValue] = useState('');
    const [selectedHardcodedValue, setSelectedHardcodedValue] = useState('');
  
    const handleValidate = () => {
        // Construct payload
        const payload = {
          apiValue: selectedApiValue,
          hardcodedValue: selectedHardcodedValue
        };
      
        // Send API request using fetch
        fetch('api/endpoint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
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
          <ApiDropdown onChange={e => setSelectedApiValue(e.target.value)} />
          <Dropdown onChange={e => setSelectedHardcodedValue(e.target.value)} />
        </div>
        <div className="validate-wrapper">
          <ValidateButton onClick={handleValidate} />
        </div>
      </div>
    );
};
  

export default MainComponent;