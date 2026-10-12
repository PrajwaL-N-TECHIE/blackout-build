import { useEffect, useRef, useState } from 'react';

export function DinosaurCompanion() {
  const dragonRef = useRef<HTMLDivElement>(null);
  const [isBreathingFire, setIsBreathingFire] = useState(false);
  const [flightMode, setFlightMode] = useState<'perched' | 'flying'>('perched');
  const fireTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synthesized crackling flame audio puff
  const playFlameSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') void ctx.resume();

      const now = ctx.currentTime;
      // Low flame whoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(170, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.85);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.95);

      // Breath noise hiss
      const bufferSize = Math.floor(ctx.sampleRate * 0.85);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(780, now);
      filter.Q.setValueAtTime(2.2, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.025, now + 0.18);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.9);
    } catch {
      // Audio unsupported or blocked
    }
  };

  const triggerFireBreath = () => {
    setIsBreathingFire(true);
    playFlameSound();
    if (fireTimerRef.current) clearTimeout(fireTimerRef.current);
    fireTimerRef.current = setTimeout(() => {
      setIsBreathingFire(false);
    }, 1350);
  };

  useEffect(() => {
    // Periodic fire breath every 5.5s
    const interval = setInterval(() => {
      triggerFireBreath();
    }, 5500);

    return () => {
      clearInterval(interval);
      if (fireTimerRef.current) clearTimeout(fireTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return;

    let targetX = window.innerWidth * 0.82;
    let targetY = 220;
    let currentX = targetX;
    let currentY = targetY;
    let angle = -6;
    let frame = 0;

    const handlePointerMove = (e: PointerEvent) => {
      // Offset slightly to the right & below so it doesn't block cursor clicks
      targetX = e.clientX + 32;
      targetY = e.clientY + 22;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 150) {
        setFlightMode('flying');
      } else {
        setFlightMode('perched');
      }
    };

    const animateLoop = () => {
      const el = dragonRef.current;
      if (el) {
        if (window.scrollY <= 150) {
          // Perched idle mode at mountain cliff
          const perchedX = Math.max(window.innerWidth * 0.78, window.innerWidth - 220);
          const perchedY = 190;
          currentX += (perchedX - currentX) * 0.08;
          currentY += (perchedY - currentY) * 0.08;
          angle += (-6 - angle) * 0.08;

          el.style.setProperty('--dino-x', `${currentX}px`);
          el.style.setProperty('--dino-y', `${currentY}px`);
          el.style.setProperty('--dino-angle', `${angle}deg`);
          el.style.setProperty('--dino-scale', `1.08`);
        } else {
          // Smooth flight following the cursor with natural lag & banking
          const dx = targetX - currentX;
          const dy = targetY - currentY;
          currentX += dx * 0.052;
          currentY += dy * 0.052;

          if (Math.hypot(dx, dy) > 3) {
            const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
            angle += (targetAngle - angle) * 0.085;
          }

          el.style.setProperty('--dino-x', `${currentX}px`);
          el.style.setProperty('--dino-y', `${currentY}px`);
          el.style.setProperty('--dino-angle', `${angle}deg`);
          el.style.setProperty('--dino-scale', `1`);
        }
      }
      frame = requestAnimationFrame(animateLoop);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    frame = requestAnimationFrame(animateLoop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={dragonRef}
      onClick={triggerFireBreath}
      className={`dinosaur-follower fixed top-0 left-0 z-40 select-none pointer-events-auto cursor-pointer will-change-transform ${
        flightMode === 'perched' ? 'dino-perched' : 'dino-flying'
      }`}
      title="✦ Click the dinosaur companion to roar fire!"
      style={{
        transform: `translate(calc(var(--dino-x, 82vw) - 60px), calc(var(--dino-y, 200px) - 45px)) rotate(var(--dino-angle, -6deg)) scale(var(--dino-scale, 1))`,
        filter: 'drop-shadow(0 6px 14px rgba(0, 0, 0, 0.28))',
      }}
    >
      <div className="relative w-32 h-24 sm:w-36 sm:h-28">
        {/* Rocky Mountain Cliff Silhouette (Visible only when perched at top) */}
        {flightMode === 'perched' && (
          <div className="absolute -bottom-2 right-2 w-28 h-9 pointer-events-none -z-10 animate-fadeIn">
            <svg viewBox="0 0 110 35" className="fill-slate-900/80 drop-shadow-md">
              <path d="M0,35 L14,12 L32,16 L54,5 L78,11 L98,24 L110,35 Z" />
              {/* Rock highlights */}
              <path d="M14,12 L32,16 M54,5 L78,11" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" />
            </svg>
          </div>
        )}

        {/* Minimalist, Creative, Unique Vector SVG Dinosaur / Wyvern */}
        <svg
          viewBox="0 0 160 110"
          className={`w-full h-full overflow-visible ${
            flightMode === 'flying' ? 'animate-dino-flying-bob' : 'animate-dino-idle-breathe'
          }`}
        >
          <defs>
            {/* Dragon Sleek Body Gradient */}
            <linearGradient id="dinoBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="55%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Wing Membrane Translucent Gradient */}
            <linearGradient id="dinoWingGrad" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.92" />
              <stop offset="45%" stopColor="#c084fc" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.75" />
            </linearGradient>

            {/* Radiant Flame Breath Gradient */}
            <linearGradient id="dinoFlameGrad" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Far Wing (Behind Body - Flaps with natural offset) */}
          <g className={flightMode === 'flying' ? 'dino-wing-flap-far' : ''}>
            <path
              d="M72 44 C82 18, 108 8, 126 12 C116 26, 118 36, 108 42 C98 34, 88 40, 78 46 Z"
              fill="url(#dinoWingGrad)"
              stroke="#0369a1"
              strokeWidth="1.5"
              opacity="0.85"
            />
          </g>

          {/* Trailing Tail with Rudder Fin */}
          <path
            d="M52 56 C38 60, 22 64, 8 72 C14 62, 24 55, 38 52 Z"
            fill="url(#dinoBodyGrad)"
            stroke="#075985"
            strokeWidth="1.5"
          />
          {/* Tail Fin Spikes */}
          <path d="M12 70 L6 76 L14 74 L8 80 L18 73" fill="#a855f7" />

          {/* Dinosaur Torso & Hind Legs */}
          <path
            d="M48 52 C45 42, 54 36, 68 40 C76 43, 82 50, 78 60 C72 68, 54 66, 48 52 Z"
            fill="url(#dinoBodyGrad)"
            stroke="#075985"
            strokeWidth="2"
          />

          {/* Claws / Talons */}
          <path
            d="M62 62 L60 72 L64 71 M68 62 L68 73 L72 70"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Near Wing (Foreground - Flaps prominently in flight) */}
          <g className={flightMode === 'flying' ? 'dino-wing-flap-near' : ''}>
            {/* Wing Arm Bone */}
            <path
              d="M65 42 C74 15, 102 4, 122 8 C118 16, 124 22, 118 30 C106 38, 92 42, 65 42 Z"
              fill="url(#dinoWingGrad)"
              stroke="#0369a1"
              strokeWidth="2"
            />
            {/* Leathery Wing Veins / Struts */}
            <path
              d="M86 20 C96 24, 108 28, 118 30 M78 30 C90 35, 100 40, 106 48"
              stroke="#0369a1"
              strokeWidth="1.2"
              strokeOpacity="0.6"
              fill="none"
            />
            {/* Wing Finger Claws */}
            <circle cx="122" cy="8" r="2" fill="#0f172a" />
          </g>

          {/* Graceful Neck & Head */}
          <path
            d="M74 44 C84 38, 96 32, 112 30 C122 28, 134 26, 142 32 C132 38, 120 40, 108 44 C96 48, 86 52, 74 44 Z"
            fill="url(#dinoBodyGrad)"
            stroke="#075985"
            strokeWidth="2"
          />

          {/* Crest / Horns on Head */}
          <path
            d="M112 28 C116 18, 124 14, 130 18 C124 24, 120 28, 114 30 Z"
            fill="#a855f7"
            stroke="#6b21a8"
            strokeWidth="1.5"
          />

          {/* Glowing Amber Eye */}
          <circle cx="126" cy="31" r="3.2" fill="#0f172a" />
          <circle cx="126" cy="31" r="2" fill="#fbbf24" />
          <circle cx="127" cy="30" r="0.8" fill="#ffffff" />

          {/* Snout & Jaw */}
          <path
            d="M136 33 L144 32 C142 35, 138 36, 135 36 Z"
            fill="#0369a1"
            stroke="#075985"
            strokeWidth="1.5"
          />

          {/* Minimalist Animated Fire Breath (Roaring flame plume!) */}
          {isBreathingFire && (
            <g className="animate-flame-puff origin-left" style={{ transformOrigin: '142px 34px' }}>
              {/* Outer Flame Cone */}
              <path
                d="M142 34 C165 24, 185 20, 215 16 C200 32, 205 45, 180 50 C160 46, 150 40, 142 34 Z"
                fill="url(#dinoFlameGrad)"
                filter="drop-shadow(0 0 10px #f97316)"
              />
              {/* Mid Layer Orange Tongue */}
              <path
                d="M142 34 C160 27, 178 24, 198 22 C186 33, 188 40, 168 42 C155 40, 148 37, 142 34 Z"
                fill="#fb923c"
                opacity="0.88"
              />
              {/* Inner White-Hot Plasma Stream */}
              <path
                d="M142 34 C158 29, 175 28, 190 26 C180 36, 172 38, 158 37 Z"
                fill="#ffffff"
                opacity="0.95"
              />
              {/* Fiery Embers & Sparks */}
              <circle cx="218" cy="18" r="2" fill="#fde047" className="animate-ping" />
              <circle cx="205" cy="38" r="2.5" fill="#f97316" className="animate-pulse" />
              <circle cx="195" cy="48" r="1.8" fill="#ef4444" className="animate-ping" />
              <circle cx="180" cy="14" r="1.5" fill="#fef08a" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
