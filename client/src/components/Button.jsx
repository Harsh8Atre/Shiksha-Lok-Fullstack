import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', loading, disabled, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} btn-${size} ${className}`}
    >
      {loading && <span className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>}
      {children}
    </button>
  );
};

export default Button;
