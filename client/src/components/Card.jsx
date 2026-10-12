import React from 'react';

const Card = ({ children, className = '', onClick, hoverable }) => {
  return (
    <div 
      className={`card ${hoverable ? 'hoverable' : ''} ${className}`} 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  );
};

export default Card;
