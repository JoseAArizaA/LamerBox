import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = ({ mensaje = "Cargando..." }) => {
  return (
    <div className="loading-wrapper">
      <div className="spinner"></div>
      {mensaje && <p className="loading-text">{mensaje}</p>}
    </div>
  );
};

export default LoadingAnimation;