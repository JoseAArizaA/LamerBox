import React from 'react';
import './Button.css';

const Button = ({ text, onClick, variant = 'primary' }) => {
  return (
    <button className={`custom-btn ${variant}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;