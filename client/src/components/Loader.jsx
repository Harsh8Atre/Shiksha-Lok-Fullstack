import React from 'react';

const Loader = ({ size = 'md', fullPage }) => {
  const sizes = { sm: '16px', md: '32px', lg: '48px' };
  const loader = <div className="loader" style={{ width: sizes[size], height: sizes[size] }}></div>;

  if (fullPage) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loader}
      </div>
    );
  }
  return loader;
};

export default Loader;
