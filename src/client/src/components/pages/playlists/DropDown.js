import React from 'react';

const DropDown = () => {
  const options = [
    // plus tard ça sera des id les value
    { value: '1', label: 'Tag 1' },
    { value: '2', label: 'Tag 2' },
    { value: '3', label: 'tag 3' },
  ];

  return (
    <select>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
};

export default DropDown;