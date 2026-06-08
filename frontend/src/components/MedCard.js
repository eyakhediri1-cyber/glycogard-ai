import React from 'react';
import './MedCard.css';

const MedCard = ({ title, icon, badge, children, className = '' }) => {
  return (
    <div className={`med-card card-enter ${className}`}>
      <div className="med-card-header">
        <div className="med-card-title-group">
          {icon && <span className="med-card-icon">{icon}</span>}
          <h3 className="med-card-title">{title}</h3>
        </div>
        {badge && <span className="med-card-badge">{badge}</span>}
      </div>
      <div className="med-card-body">
        {children}
      </div>
    </div>
  );
};

export default MedCard;
