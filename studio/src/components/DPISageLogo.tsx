import React from 'react';

interface DPISageLogoProps {
  className?: string;
  size?: number;
}

export const DPISageLogo: React.FC<DPISageLogoProps> = ({ className = "", size = 24 }) => {
  return (
    <img
      src="/sage-logo.png"
      alt="DPI Sage - Digital Wise Assistant"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain'
      }}
      className={className}
    />
  );
};