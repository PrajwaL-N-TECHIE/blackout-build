import { useEffect, useRef, useState } from 'react';
import './surfing-boat-marine.css';

interface SurfingBoatMarineProps {
  className?: string;
  scrollReactive?: boolean;
}

export function SurfingBoatMarine({
  className = '',
  scrollReactive = true,
}: SurfingBoatMarineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boatRef = useRef<HTMLDivElement>(null);
  const [boatXPercent, setBoatXPercent] = useState<number>(50);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let t = 0;

    const animate = () => {
      t += 0.008;
      // Gentle ocean patrol cruising between 25% and 75%
      const patrol = 50 + Math.sin(t) * 24;
      
      if (scrollReactive && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const winH = window.innerHeight;
        if (rect.top < winH && rect.bottom > 0) {
          const scrollProgress = (winH - rect.top) / (winH + rect.height);
          // Combine patrol sway with scroll momentum
          const scrollOffset = (scrollProgress - 0.5) * 36;
          const clamped = Math.max(15, Math.min(85, patrol + scrollOffset));
          setBoatXPercent(clamped);
        } else {
          setBoatXPercent(patrol);
        }
      } else {
        setBoatXPercent(patrol);
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [scrollReactive]);

  return (
    <div
      ref={containerRef}
      className={`sea-container select-none ${className}`}
      aria-label="Surfing boat riding the ocean tide waves"
    >
      {/* Background horizon line */}
      <div className="horizon" aria-hidden="true" />

      {/* Back deep wave layer */}
      <div className="wave back" aria-hidden="true" />

      {/* Mid dynamic wave layer */}
      <div className="wave mid" aria-hidden="true" />

      {/* Surfing boat container layered directly between mid and front waves */}
      <div
        ref={boatRef}
        className="boat-wrapper"
        style={{ left: `${boatXPercent.toFixed(1)}%` }}
      >
        {/* Custom Vector Art Boat Matching the Picture Layout */}
        <svg
          className="boat"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 100"
          aria-hidden="true"
        >
          {/* Main Hull Base */}
          <path
            d="M20,60 L160,78 C175,80 185,70 175,55 L165,45 L40,45 Z"
            fill="#ffffff"
            stroke="#0a4d68"
            strokeWidth="2"
          />
          {/* Bottom Feature Trim Strip */}
          <path
            d="M25,58 L163,74 C168,75 171,72 168,68 L162,58 L33,58 Z"
            fill="#3b7197"
          />
          {/* Cabin Deckhouse Structure */}
          <path
            d="M65,45 L135,45 L125,22 L80,22 Z"
            fill="#ffffff"
            stroke="#0a4d68"
            strokeWidth="2"
          />
          {/* Windshield / Window Glass */}
          <polygon points="105,27 120,27 126,40 105,40" fill="#a1c4fd" />
          <polygon points="85,27 98,27 98,40 85,40" fill="#a1c4fd" />
          {/* Roof Spoiler/Radar Arch Arch */}
          <path d="M115,22 L130,22 L125,15 L118,15 Z" fill="#0a4d68" />
        </svg>
      </div>

      {/* Front high-contrast wave layer overlapping the boat hull */}
      <div className="wave front" aria-hidden="true" />
    </div>
  );
}
