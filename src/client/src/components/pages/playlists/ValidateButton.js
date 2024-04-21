// ValidateButton.js
import React from 'react';

const ValidateButton = ({ onClick }) => {
  return (
    <div className="validate-button">
      <button onClick={onClick}>Validate</button>
    </div>
  );
};

export default ValidateButton;