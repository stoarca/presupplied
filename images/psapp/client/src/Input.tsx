import React, { useState } from 'react';

interface NumberInputProps {
  onInput: (input: number) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({ onInput }) => {
  const [value, setValue] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setValue(value);
    }
  };

  const handleSubmit = () => {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue)) {
      onInput(numberValue);
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(135deg, rgb(179, 253, 193) 0%, rgb(185, 248, 164) 100%)',
    borderRadius: '1000px',
    padding: '10px',
    display: 'grid',
    placeContent: 'center',
    zIndex: 0,
    maxWidth: '300px',
    margin: '0 10px',
  };

  const searchContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, rgb(218, 247, 220) 0%, rgb(214, 247, 219) 100%)',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px',
    background: 'linear-gradient(135deg, rgb(218, 247, 220) 0%, rgb(214, 247, 219) 100%)',
    width: '100%',
    // background: 'linear-gradient(135deg, rgb(200, 255, 200) 0%, rgb(180, 255, 180) 100%)',
    border: 'none',
    color: '#000',
    fontSize: '20px',
    borderRadius: '50px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    marginLeft: '10px',
    background: '#FFA200',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <div style={searchContainerStyle}>
        <input
          style={inputStyle}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Enter a number"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <button style={buttonStyle} onClick={handleSubmit}>Enter</button>

      </div>
    </div>
  );
};
