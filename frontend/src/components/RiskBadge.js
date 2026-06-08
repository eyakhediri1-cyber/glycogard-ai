import React from 'react';

const RiskBadge = ({ level }) => {
  const getStyles = () => {
    switch (level) {
      case 'Low':
        return { backgroundColor: 'var(--primary-green)', color: 'white' };
      case 'Moderate':
        return { backgroundColor: 'var(--secondary-beige)', color: 'white' };
      case 'High':
        return { backgroundColor: '#c68a4e', color: 'white' };
      case 'Critical':
        return { backgroundColor: '#8b0000', color: 'white' };
      default:
        return { backgroundColor: 'var(--light-green)', color: 'var(--primary-green)' };
    }
  };

  return (
    <span style={{ 
      ...getStyles(), 
      padding: '8px 16px', 
      borderRadius: '0', 
      fontWeight: '700', 
      display: 'inline-block',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }}>
      {level}
    </span>
  );
};

export default RiskBadge;
