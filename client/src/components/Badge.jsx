import React from 'react';

const Badge = ({ children, variant = 'default', size }) => {
  return (
    <span className={`badge badge-${variant}`} style={size ? { fontSize: size } : {}}>
      {children}
    </span>
  );
};

export default Badge;
