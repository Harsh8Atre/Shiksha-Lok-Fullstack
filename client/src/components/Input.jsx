import React from 'react';

const Input = ({ label, name, type = 'text', value, onChange, error, placeholder, required, disabled, ...rest }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}{required && <span style={{color: 'var(--danger)'}}>*</span>}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="form-input"
        {...rest}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default Input;
