import React from 'react';
import './GlucoseBadge.css';

const getGlucoseStatus = (value) => {
  if (value < 70) return { label: 'HYPOGLYCÉMIE', color: 'var(--color-hypo)', bg: 'var(--color-hypo-bg)', class: 'status-hypo' };
  if (value < 80) return { label: 'BAS', color: 'var(--color-low)', bg: 'var(--color-low-bg)', class: 'status-low' };
  if (value <= 180) return { label: 'DANS LA CIBLE', color: 'var(--color-in-range)', bg: 'var(--color-in-range-bg)', class: 'status-normal' };
  if (value <= 250) return { label: 'ÉLEVÉ', color: 'var(--color-high)', bg: 'var(--color-high-bg)', class: 'status-high' };
  return { label: 'HYPERGLYCÉMIE', color: 'var(--color-hyper)', bg: 'var(--color-hyper-bg)', class: 'status-hyper' };
};

const getTrendIcon = (trend) => {
  switch (trend) {
    case 'rising_fast': return '↑↑';
    case 'rising': return '↗';
    case 'stable': return '→';
    case 'falling': return '↘';
    case 'falling_fast': return '↓↓';
    default: return '→';
  }
};

const GlucoseBadge = ({ value, trend, showLabel = true }) => {
  const status = getGlucoseStatus(value);
  
  return (
    <div className={`glucose-badge-container ${status.class}`}>
      <div className="glucose-value-group">
        <span className="glucose-value">{value}</span>
        <span className="glucose-unit">mg/dL</span>
        <span className={`glucose-trend ${trend}`}>{getTrendIcon(trend)}</span>
      </div>
      {showLabel && (
        <div className="glucose-status-label" style={{ backgroundColor: status.bg, color: status.color }}>
          {status.label}
        </div>
      )}
    </div>
  );
};

export default GlucoseBadge;
