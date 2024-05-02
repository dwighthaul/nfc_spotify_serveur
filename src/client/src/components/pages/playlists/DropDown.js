import React from 'react';

const DropDown = (props) => {

  var handleChange = (e) => {
    console.log(e.target.value)
    props.onChange(e.target.value)
  }

  const options = [
    // plus tard ça sera des id les value
    { value: '01e292f7acdfa063eef76481b7b88c7260d31aee', label: 'Toi' },
    { value: '50c14080a6b470701bbf7baada526a6133acc4da', label: 'Moi' }
  ];

  return (
    <select onChange={handleChange}>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
};

export default DropDown;