import { useEffect, useRef, useState } from 'react';
import { SurfingBoat } from '@/components/surfing-boat';

export function SeaBeachTransition() {
  const waveRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0.2);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = waveRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const winH = window.innerHeight;
        // Parallax progress when wave is in viewport
        if (rect.top < winH && rect.bottom > 0) {
          const progress = Math.max(0, Math.min(1, (winH - rect.top) / (winH + rect.height)));
          setScrollProgress(progress);
          const shift1 = Math.sin(progress * Math.PI * 2) * 20;
          const shift2 = Math.cos(progress * Math.PI * 2) * 25;
          el.style.setProperty('--wave-shift-1', `${shift1}px`);
          el.style.setProperty('--wave-shift-2', `${shift2}px`);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={waveRef}
      className="sea-beach-transition relative w-full overflow-hidden select-none pointer-events-none -my-1"
      aria-hidden="true"
    >
      {/* Sandy Beach Shore / Transition Zone */}
      <div className="relative w-full h-12 bg-gradient-to-b from-transparent to-[#fef08a]/20" />

      {/* Wave Layer 1: Back Coastal Current (Deep Aqua) */}
      <div className="relative w-[115%] -left-[7%] transform translate-x-[var(--wave-shift-2,0px)] transition-transform duration-75">
        <div className="animate-wave-smooth-2">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full h-16 sm:h-24 fill-[#0284c7]/35"
          >
            <path d="M0,32 C240,75 480,10 720,48 C960,86 1200,20 1440,54 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      {/* Wave Layer 2: Midground Translucent Sea Turquoise with Foam Edge */}
      <div className="relative w-[115%] -left-[7%] -mt-10 sm:-mt-16 transform -translate-x-[var(--wave-shift-1,0px)] transition-transform duration-75">
        <div className="animate-wave-smooth-1">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full h-16 sm:h-24 fill-[#38bdf8]/60"
          >
            <path d="M0,50 C320,12 640,80 960,35 C1200,60 1360,25 1440,42 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      {/* The Surfing Boat Riding the Mid-Wave (Layered between mid and front wave) */}
      <SurfingBoat scrollProgress={scrollProgress} direction="ltr" bottomOffset={40} className="z-10" />

      {/* Wave Layer 3: Foreground Brilliant Foamy Wave Crest Overlapping Boat Hull */}
      <div className="relative w-[115%] -left-[7%] -mt-8 sm:-mt-14 transform translate-x-[var(--wave-shift-1,0px)] transition-transform duration-75 z-20">
        <div className="animate-wave-smooth-3">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full h-14 sm:h-20 fill-[#a5f3fc]/80"
          >
            <path d="M0,64 C280,24 560,78 840,44 C1120,70 1300,32 1440,50 L1440,120 L0,120 Z" />
            {/* Frothy white wave lip */}
            <path
              d="M0,64 C280,24 560,78 840,44 C1120,70 1300,32 1440,50"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeOpacity="0.9"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
