import * as React from 'react';

const Alert: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div style={{ backgroundColor: 'green', color: '#fff', padding: '1em' }}>
      {message}
    </div>
  )
};

export default Alert;
