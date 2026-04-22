import React from 'react';
import './Button.css';

// Usamos props para que el botón sea reutilizable como en tus clases
const Button = ({ text, onClick, variant = 'primary' }) => {
  return (
    <button className={`custom-btn ${variant}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;