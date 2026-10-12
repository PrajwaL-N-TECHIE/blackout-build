import { useEffect, useRef, useState } from 'react';
import { Compass, Sparkles, MessageCircle, X, Check, Droplets, Waves, Rocket, Zap, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playStickerPop } from '@/lib/chime';
import { SurfingBoat } from '@/components/surfing-boat';

interface Bubble {
  id: number;
  x: number; // percentage
  size: number; // px
}

export function SeaRiseTransition() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0.2);
  const [bottleOpen, setBottleOpen] = useState(false);
  const [poppedBubbles, setPoppedBubbles] = useState<Set<number>>(new Set());

  // Interactive glowing bubbles
  const bubbles: Bubble[] = [
    { id: 1, x: 12, size: 28 },
    { id: 2, x: 28, size: 22 },
    { id: 3, x: 45, size: 34 },
    { id: 4, x: 62, size: 24 },
    { id: 5, x: 79, size: 30 },
    { id: 6, x: 92, size: 20 },
  ];

  const handlePopBubble = (id: number) => {
    playStickerPop(540 + id * 50);
    setPoppedBubbles((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setPoppedBubbles((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 4000);
  };

  const handleOpenBottle = () => {
    playStickerPop(680);
    setBottleOpen(true);
  };

  const handleCloseBottle = () => {
    playStickerPop(420);
    setBottleOpen(false);
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const winH = window.innerHeight;

        // Progress: 0 when top enters bottom of window -> 1 when bottom leaves top
        if (rect.top <= winH && rect.bottom >= 0) {
          const totalDist = winH + rect.height;
          const progress = Math.max(0, Math.min(1, (winH - rect.top) / totalDist));

          // 1. Staggered card parallax floating & 3D tilt
          if (card1Ref.current) {
            const y1 = (1 - progress) * 55;
            const r1 = -2.5 + progress * 2.5;
            card1Ref.current.style.transform = `translateY(${y1}px) rotate(${r1}deg)`;
          }
          if (card2Ref.current) {
            const y2 = (1 - progress) * 85;
            const s2 = 0.94 + progress * 0.06;
            card2Ref.current.style.transform = `translateY(${y2}px) scale(${s2})`;
          }
          if (card3Ref.current) {
            const y3 = (1 - progress) * 115;
            const r3 = 2.5 - progress * 2.5;
            card3Ref.current.style.transform = `translateY(${y3}px) rotate(${r3}deg)`;
          }

          // 2. Rising sea tide surging upward from down to up!
          if (waterRef.current) {
            // Water physically swells up from bottom (translateY from 90px down to -30px)
            const waterY = (1 - progress) * 110 - 25;
            waterRef.current.style.transform = `translateY(${waterY}px)`;

            // Wave crests sway horizontally in counter-motion
            const sway1 = Math.sin(progress * Math.PI * 3) * 45;
            const sway2 = -Math.cos(progress * Math.PI * 3) * 55;
            waterRef.current.style.setProperty('--wave-sway-1', `${sway1}px`);
            waterRef.current.style.setProperty('--wave-sway-2', `${sway2}px`);

            // Update origami surfing boat horizontal progression across wave crest as user scrolls
            const waterRect = waterRef.current.getBoundingClientRect();
            if (waterRect.top <= winH && waterRect.bottom >= 0) {
              const waveProgress = Math.max(0, Math.min(1, (winH - waterRect.top) / (winH + waterRect.height)));
              setScrollProgress(waveProgress);
            }
          }

          // 3. Floating Message in a Bottle: bobs on the rising water crest!
          if (bottleRef.current) {
            const bottleFloatY = (1 - progress) * 45 - Math.sin(progress * Math.PI * 4) * 12;
            const bottleRotate = Math.sin(progress * Math.PI * 3) * 9 - 4;
            bottleRef.current.style.transform = `translateY(${bottleFloatY}px) rotate(${bottleRotate}deg)`;
          }
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
    <section
      ref={sectionRef}
      className="sea-rise-section relative w-full overflow-hidden py-16 md:py-24 bg-gradient-to-b from-background via-sky-50/70 to-sky-900/15 dark:from-background dark:via-sky-950/30 dark:to-night border-y border-border/40"
      aria-label="The Coastal Threshold and Rising Sea"
    >
      {/* Decorative Sandy Beach Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:26px_26px]" />

      <div className="section-inner relative z-10 max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 reveal">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 border border-sky-300/60 dark:border-sky-700/60 text-sky-900 dark:text-sky-200 text-xs font-mono font-bold uppercase tracking-widest shadow-sm">
            <Waves className="w-3.5 h-3.5 text-sky-500 animate-pulse" /> THE COASTAL THRESHOLD · TIDE SWELL
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-semibold tracking-tight text-foreground">
            Where bold ideas leave <em>the shoreline.</em>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
            As the tide swells upward, we leave familiar ground behind. Eight hours of uninterrupted creation,
            one unannounced twist, and memories forged in deep waters.
          </p>
        </div>

        {/* 3 Scroll-Animated Coastal Milestone Cards (Staggered Parallax & Floating Motion) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
          {/* Card 1: Coastline Launch */}
          <div
            ref={card1Ref}
            className="group relative rounded-2xl p-6 bg-card/80 backdrop-blur-md border border-sky-200/80 dark:border-sky-800/60 shadow-lg hover:shadow-2xl hover:border-sky-400 transition-all duration-300 overflow-hidden will-change-transform"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-sky-400/10 rounded-full blur-2xl group-hover:bg-sky-400/25 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/60 flex items-center justify-center text-sky-600 dark:text-sky-300 mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
              01 · COASTLINE LAUNCH
            </span>
            <h3 className="text-xl font-display font-semibold text-foreground mb-2">
              Squad Formation
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Assemble your team of builders, secure your station, and catch the incoming tide as the countdown
              strikes zero.
            </p>
          </div>

          {/* Card 2: The Midnight Swell */}
          <div
            ref={card2Ref}
            className="group relative rounded-2xl p-6 bg-card/80 backdrop-blur-md border border-amber-200/80 dark:border-amber-800/60 shadow-lg hover:shadow-2xl hover:border-amber-400 transition-all duration-300 overflow-hidden will-change-transform"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/25 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-300 mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
              02 · THE MIDNIGHT SWELL
            </span>
            <h3 className="text-xl font-display font-semibold text-foreground mb-2">
              The Secret Twist
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              The unrevealed twist breaks like a rogue wave at kickoff. No preparation can anticipate it — only quick,
              creative wits.
            </p>
          </div>

          {/* Card 3: 8-Hour Deep Dive */}
          <div
            ref={card3Ref}
            className="group relative rounded-2xl p-6 bg-card/80 backdrop-blur-md border border-teal-200/80 dark:border-teal-800/60 shadow-lg hover:shadow-2xl hover:border-teal-400 transition-all duration-300 overflow-hidden will-change-transform"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-teal-400/10 rounded-full blur-2xl group-hover:bg-teal-400/25 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/60 flex items-center justify-center text-teal-600 dark:text-teal-300 mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-1">
              03 · 8-HOUR DEEP DIVE
            </span>
            <h3 className="text-xl font-display font-semibold text-foreground mb-2">
              Uninterrupted Sprint
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Eight intense hours of pure execution. Rapid prototypes, live demos, and a memorable showcase before
              the dawn tide settles.
            </p>
          </div>
        </div>

        {/* Interactive Centerpiece: Message in a Bottle Bobbing on the Rising Tide */}
        <div className="relative flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-r from-sky-400/20 via-teal-300/25 to-sky-500/20 border border-sky-300/50 backdrop-blur-md shadow-inner text-center overflow-hidden">

          {/* Bobbing Vector Bottle with Parallax Water Float */}
          <div
            ref={bottleRef}
            onClick={handleOpenBottle}
            className="group cursor-pointer select-none inline-flex flex-col items-center transform hover:scale-110 transition-transform will-change-transform"
            title="Click to uncork the secret bottle!"
          >
            <div className="relative w-16 h-28 sm:w-20 sm:h-36 drop-shadow-xl filter">
              <svg viewBox="0 0 80 140" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="bottleGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.88" />
                    <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.65" />
                  </linearGradient>
                  <linearGradient id="bottleScrollGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>

                {/* Cork Stopper */}
                <path d="M30 6 L50 6 L47 18 L33 18 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />

                {/* Bottle Neck */}
                <path d="M28 18 L52 18 L50 36 L30 36 Z" fill="url(#bottleGlassGrad)" stroke="#38bdf8" strokeWidth="1.5" />
                <ellipse cx="40" cy="18" rx="12" ry="3" fill="#bae6fd" />

                {/* Bottle Body */}
                <path
                  d="M30 36 C18 42, 10 56, 10 74 L10 118 C10 130, 22 136, 40 136 C58 136, 70 130, 70 118 L70 74 C70 56, 62 42, 50 36 Z"
                  fill="url(#bottleGlassGrad)"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />

                {/* Rolled Secret Parchment Scroll Inside Bottle */}
                <path
                  d="M26 70 C28 62, 50 64, 52 72 L48 116 C46 122, 28 120, 24 114 Z"
                  fill="url(#bottleScrollGrad)"
                  stroke="#d97706"
                  strokeWidth="1.5"
                />
                <rect x="24" y="90" width="28" height="6" rx="2" fill="#ef4444" />

                {/* Glass Reflection Highlight */}
                <path d="M16 68 L16 114 C16 122, 20 126, 26 128" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.65" fill="none" />
              </svg>

              {/* Pulsing beacon ping */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-400/60 animate-ping pointer-events-none" />
            </div>

            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper/95 dark:bg-card/95 border border-sky-400/50 text-xs font-mono font-bold text-night shadow-sm group-hover:border-primary">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" /> Click to Uncork Secret Dispatch
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3 max-w-sm">
            A bottle washed ashore from the organizers. What secrets lie inside?
          </p>
        </div>

        {/* Modal: Unrolled Parchment Secret Note */}
        {bottleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/65 backdrop-blur-md animate-fadeIn">
            <div className="relative max-w-md w-full bg-[#fefce8] dark:bg-card text-night border-4 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 transform animate-scaleUp">
              <button
                onClick={handleCloseBottle}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-amber-200/60 text-night/70 transition-colors"
                aria-label="Close dispatch"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-amber-700 font-mono text-xs font-bold uppercase tracking-widest">
                <Compass className="w-4 h-4 text-amber-600" /> OFFICIAL BUILDICY DISPATCH
              </div>

              <h4 className="text-2xl font-display font-bold text-night">
                “To the builders who venture into the deep...”
              </h4>

              <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-300/60 text-xs sm:text-sm font-sans leading-relaxed text-night/85 italic">
                “The greatest discoveries in human history were not made along comfortable shorelines. They happened
                when curious teams sailed past the horizon into the unknown. Bring your energy, look after your crew,
                and prepare for a surprise at zero hour.”
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] font-mono font-bold text-amber-900/60">
                  ✦ Blackout Edition · Buildicy
                </span>
                <Button variant="hero" size="sm" onClick={handleCloseBottle}>
                  Reseal Bottle <Check className="ml-1 w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Clickable Bubbles in the Rising Surf */}
        <div className="relative w-full h-18 mt-6 overflow-hidden pointer-events-auto">
          <div className="text-center text-[11px] font-mono font-bold text-sky-700 dark:text-sky-300 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
            <Droplets className="w-3.5 h-3.5" /> Click glowing surf bubbles to pop!
          </div>

          <div className="relative w-full h-10 flex justify-around items-center">
            {bubbles.map((b) => (
              <button
                key={b.id}
                onClick={() => handlePopBubble(b.id)}
                className={`relative rounded-full transition-transform duration-200 hover:scale-125 focus:outline-none ${
                  poppedBubbles.has(b.id) ? 'scale-0 opacity-0' : 'scale-100 opacity-90'
                }`}
                style={{
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  background: 'radial-gradient(circle at 30% 30%, #ffffff, #67e8f9 50%, #0284c7 100%)',
                  boxShadow: '0 0 12px rgba(56, 189, 248, 0.65), inset 0 0 4px rgba(255, 255, 255, 0.8)',
                }}
                aria-label={`Pop bubble ${b.id}`}
              >
                <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white opacity-80" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Rising Wave Tide SVG (Physically surges UPWARDS from down to up with scroll!) */}
      <div
        ref={waterRef}
        className="relative w-full mt-6 pointer-events-none will-change-transform"
        style={{
          transform: 'translateY(60px)',
          transition: 'transform 0.08s ease-out',
        }}
      >
        {/* Layer 1: Back Dynamic Wave Layer */}
        <div
          className="relative w-[120%] -left-[10%] transition-transform duration-75"
          style={{ transform: 'translateX(var(--wave-sway-1, 0px))' }}
        >
          <div className="animate-wave-smooth-1">
            <svg
              viewBox="0 0 1440 100"
              preserveAspectRatio="none"
              className="w-full h-16 sm:h-24 fill-[#0369a1]/40 drop-shadow"
            >
              <path d="M0,45 C240,15 480,75 720,35 C960,80 1200,20 1440,55 L1440,100 L0,100 Z" />
            </svg>
          </div>
        </div>

        {/* Layer 2: Translucent Cyan Swell (Surges with wave-sway-2 + smooth undulating swell) */}
        <div
          className="relative w-[120%] -left-[10%] -mt-10 sm:-mt-16 transition-transform duration-75 z-20"
          style={{ transform: 'translateX(var(--wave-sway-2, 0px))' }}
        >
          <div className="animate-wave-smooth-2">
            <svg
              viewBox="0 0 1440 100"
              preserveAspectRatio="none"
              className="w-full h-16 sm:h-24 fill-[#38bdf8]/75"
            >
              <path d="M0,55 C320,25 640,85 960,40 C1200,75 1360,30 1440,50 L1440,100 L0,100 Z" />
            </svg>
          </div>
        </div>

        {/* Surfing Boat riding high on the coastal tide waves */}
        <SurfingBoat
          scrollProgress={scrollProgress}
          direction="ltr"
          bottomOffset={64}
          className="z-30 pointer-events-auto"
        />

        {/* Layer 3: Vibrant Deep Ocean Turquoise Wave Base */}
        <div className="relative w-[120%] -left-[10%] -mt-8 sm:-mt-14 z-10">
          <div className="animate-wave-smooth-3">
            <svg
              viewBox="0 0 1440 100"
              preserveAspectRatio="none"
              className="w-full h-14 sm:h-20 fill-[#0284c7]"
            >
              <path d="M0,60 C280,35 560,85 840,45 C1120,80 1300,40 1440,55 L1440,100 L0,100 Z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
