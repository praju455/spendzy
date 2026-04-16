import React from 'react';

const GlassCard = ({ children, className = '', style = {}, glow = false }) => {
  return (
    <div 
      className={`card glass ${glow ? 'glass-glow' : ''} ${className}`} 
      style={style}
    >
      {children}
    </div>
  );
};

export default GlassCard;
