import React from 'react';
import './parallax-starfield.css';

interface ParallaxStarfieldProps {
  className?: string;
  children?: React.ReactNode;
}

export function ParallaxStarfield({
  className = '',
  children,
}: ParallaxStarfieldProps) {
  return (
    <div
      className={`parallax-starfield-container absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
      {children}
    </div>
  );
}
