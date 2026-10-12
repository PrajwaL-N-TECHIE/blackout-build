import { useEffect, useRef, useState } from 'react';
import { playStickerPop } from '@/lib/chime';

interface SurfingBoatProps {
  scrollProgress: number; // 0 to 1
  direction?: 'ltr' | 'rtl';
  className?: string;
  bottomOffset?: number;
}

export function SurfingBoat({
  scrollProgress,
  direction = 'ltr',
  className = '',
  bottomOffset = 62,
}: SurfingBoatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;
  const [turboActive, setTurboActive] = useState(false);
  const turboBoostRef = useRef(1);

  const handleBoatClick = () => {
    playStickerPop(640);
    setTurboActive(true);
    turboBoostRef.current = 2.4;
    setTimeout(() => {
      turboBoostRef.current = 1;
      setTurboActive(false);
    }, 1500);
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let t = 0;
    let smoothScroll = scrollRef.current;

    const animate = () => {
      // Delta multiplied by turbo boost factor
      const speed = 0.016 * turboBoostRef.current;
      t += speed;

      if (containerRef.current) {
        // Smoothly interpolate scroll momentum for butter-soft surfing response
        smoothScroll += (scrollRef.current - smoothScroll) * 0.06;

        // Continuous smooth cruising surfing motion across the wave
        const cruiseX = ((t * 7.5) % 116) - 8; // -8% to 108%
        const scrollDrive = (smoothScroll * 35) % 100;
        let boatX = (cruiseX + scrollDrive) % 116 - 8;
        if (boatX < -8) boatX += 116;

        if (direction === 'rtl') {
          boatX = 100 - boatX;
        }

        // Responsive offset: adjust slightly for mobile screens
        const isMobile = window.innerWidth < 640;
        const effectiveOffset = isMobile ? bottomOffset * 0.75 : bottomOffset;

        // Wave contour height physics: y = sin(kx - phase) * A
        const k = 0.075;
        const phase = t * 2.2;
        const waveArg = boatX * k - phase;
        const waveY = Math.sin(waveArg) * 14;

        // Wave slope tangent physics: dy/dx = cos(kx - phase) * k * A
        const slope = Math.cos(waveArg) * 0.45;
        const pitchAngle = Math.atan(slope) * (180 / Math.PI) * (direction === 'ltr' ? 1 : -1);
        const crestBounce = Math.sin(t * 3.6) * 3.2;

        containerRef.current.style.left = `${boatX.toFixed(2)}%`;
        containerRef.current.style.bottom = `${(effectiveOffset + waveY).toFixed(1)}px`;
        containerRef.current.style.transform = `translateX(-50%) rotate(${(pitchAngle + crestBounce).toFixed(2)}deg) ${
          direction === 'rtl' ? 'scaleX(-1)' : ''
        }`;
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [direction, bottomOffset]);

  return (
    <div
      ref={containerRef}
      onClick={handleBoatClick}
      className={`surfing-boat-container absolute pointer-events-auto select-none z-30 cursor-pointer will-change-transform group transition-transform ${className}`}
      style={{
        left: '15%',
        bottom: `${bottomOffset}px`,
        transform: 'translateX(-50%)',
      }}
      title="Surfing cabin boat — click for a turbo wave boost!"
      aria-label="Surfing boat riding the wave crests"
    >
      <div className={`relative w-32 h-16 sm:w-36 sm:h-20 filter drop-shadow-[0_12px_18px_rgba(2,132,199,0.45)] transition-transform duration-300 ${turboActive ? 'scale-110' : 'group-hover:scale-105'}`}>
        {/* Custom Vector Art Boat Matching the Picture Layout */}
        <svg
          className="boat w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 100"
        >
          {/* Main Hull Base */}
          <path
            d="M20,60 L160,78 C175,80 185,70 175,55 L165,45 L40,45 Z"
            fill="#ffffff"
            stroke="#0a4d68"
            strokeWidth="2.4"
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
            strokeWidth="2.4"
          />
          {/* Windshield / Window Glass with subtle reflection */}
          <polygon points="105,27 120,27 126,40 105,40" fill="#a1c4fd" />
          <polygon points="85,27 98,27 98,40 85,40" fill="#a1c4fd" />
          <line x1="88" y1="36" x2="95" y2="29" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />
          <line x1="108" y1="36" x2="117" y2="29" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />

          {/* Roof Spoiler/Radar Arch */}
          <path d="M115,22 L130,22 L125,15 L118,15 Z" fill="#0a4d68" />

          {/* Buildicy Mini Beacon Antenna on Cabin */}
          <line x1="122" y1="15" x2="122" y2="9" stroke="#0a4d68" strokeWidth="1.5" />
          <circle cx="122" cy="8" r="2.2" fill="#38bdf8" className="animate-pulse" />

          {/* Dynamic prow spray and water foam wake */}
          <ellipse cx="172" cy="74" rx="14" ry="4" fill="#ffffff" opacity="0.9" />
          <ellipse cx="180" cy="77" rx="8" ry="2.5" fill="#e0f2fe" opacity="0.75" />
          <ellipse cx="30" cy="62" rx="20" ry="4.5" fill="#38bdf8" opacity="0.65" />

          {/* Hydrodynamic stern wake trail */}
          <ellipse cx="14" cy="65" rx="14" ry="3" fill="#ffffff" opacity="0.7" />
          <circle cx="4" cy="66" r="3" fill="#bae6fd" opacity="0.75" />
          <circle cx="-6" cy="68" r="2.2" fill="#7dd3fc" opacity="0.5" />
          <circle cx="-16" cy="70" r="1.6" fill="#38bdf8" opacity="0.3" />

          {/* Turbo spray bursts when boosted */}
          {turboActive && (
            <>
              <circle cx="-12" cy="64" r="5" fill="#ffffff" opacity="0.8" className="animate-ping" />
              <circle cx="-22" cy="66" r="4" fill="#38bdf8" opacity="0.6" className="animate-ping" />
            </>
          )}
        </svg>

        {/* Playful Turbo tooltip indicator on hover */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-night/85 text-[10px] font-mono font-bold text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none border border-sky-400/40">
          {turboActive ? '⚡ TURBO SURF!' : '✦ CLICK FOR TURBO'}
        </div>
      </div>
    </div>
  );
}
