import { useEffect, useRef, useState } from 'react';
import buildicyLogo from '@/assets/buildicy-logo.png';

interface BuildicyBeaconProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showRays?: boolean;
  interactive?: boolean;
  className?: string;
}

export function BuildicyBeacon({
  size = 'md',
  showRays = true,
  interactive = true,
  className = '',
}: BuildicyBeaconProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // 3D Magnetic Tilt effect
  useEffect(() => {
    if (!interactive) return;
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) {
      return;
    }

    let frameId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const maxDist = 280;

      const dist = Math.hypot(distX, distY);
      if (dist < maxDist) {
        // Tilt towards mouse
        targetX = (distX / maxDist) * 18;
        targetY = (-distY / maxDist) * 18;
      } else {
        targetX = 0;
        targetY = 0;
      }
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const render = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      if (el) {
        el.style.transform = `perspective(900px) rotateY(${currentX.toFixed(2)}deg) rotateX(${currentY.toFixed(2)}deg) translateZ(${Math.abs(currentX) > 0.5 ? 12 : 0}px)`;
      }
      frameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    frameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(frameId);
    };
  }, [interactive]);

  const triggerSonarPing = () => {
    setIsPinging(true);
    setTimeout(() => setIsPinging(false), 1200);

    // Audio chime if enabled or created
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        void audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.18); // A5

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      }
    } catch {
      // AudioContext not supported or permission denied
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-36 h-36',
    hero: 'w-56 h-56 sm:w-64 sm:h-64',
  }[size];

  return (
    <div
      ref={containerRef}
      className={`buildicy-beacon-wrapper relative inline-flex items-center justify-center select-none cursor-pointer group ${className}`}
      onClick={triggerSonarPing}
      title="Buildicy Radar Beacon · Click to send sonar pulse"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerSonarPing();
        }
      }}
    >
      {/* Background radial beacon aura */}
      <div className="absolute inset-0 -m-6 rounded-full bg-primary/10 blur-2xl pointer-events-none group-hover:bg-primary/25 transition-all duration-500" />

      {/* Radar waves emanating from the beacon circular antenna at the top */}
      {showRays && (
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
          <div className="beacon-ring ring-1" />
          <div className="beacon-ring ring-2" />
          <div className="beacon-ring ring-3" />
          {isPinging && <div className="beacon-sonar-ping" />}
        </div>
      )}

      {/* The Buildicy Isometric 3D Logo */}
      <div className={`relative z-10 transition-transform duration-300 group-hover:scale-105 ${sizeClasses}`}>
        <img
          src={buildicyLogo}
          alt="Buildicy Logo"
          className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(112,50,230,0.32)] filter transition-all duration-300 group-hover:drop-shadow-[0_16px_32px_rgba(140,80,255,0.55)]"
          loading="eager"
        />

        {/* Floating holographic sparkle on hover */}
        <div className="absolute top-0 right-1/4 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 animate-ping pointer-events-none" />
      </div>

      {/* Signal indicator badge on hover */}
      {size !== 'sm' && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 pointer-events-none whitespace-nowrap bg-background/90 backdrop-blur-md border border-primary/30 text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full text-foreground shadow-sm">
          <span>📡 SIGNAL ACTIVE · 88.4 MHz</span>
        </div>
      )}
    </div>
  );
}
