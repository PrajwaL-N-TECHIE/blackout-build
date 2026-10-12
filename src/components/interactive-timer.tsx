import { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Radio,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IsometricCubeLoader } from '@/components/isometric-cube-loader';

interface InteractiveTimerProps {
  onRegisterClick: () => void;
  className?: string;
}

export function InteractiveTimer({ onRegisterClick, className = '' }: InteractiveTimerProps) {
  // Mode: 'countdown' or 'sprint-simulator'
  const [mode, setMode] = useState<'countdown' | 'simulator'>('countdown');
  const [isSoundOn, setIsSoundOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Live Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 42,
    hours: 8,
    minutes: 30,
    seconds: 15,
  });

  // Simulator State (8 Hours = 480 mins)
  const [simMinutes, setSimMinutes] = useState(0);
  const [isSimPlaying, setIsSimPlaying] = useState(false);
  const simTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live countdown update
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 42);
    target.setHours(9, 0, 0, 0);

    const update = () => {
      const now = new Date().getTime();
      const diff = target.getTime() - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulator loop
  useEffect(() => {
    if (isSimPlaying) {
      simTimerRef.current = setInterval(() => {
        setSimMinutes((prev) => {
          if (prev >= 480) {
            setIsSimPlaying(false);
            return 480;
          }
          return prev + 2; // Advance by 2 minutes each tick
        });
      }, 60);
    } else {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    }
    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [isSimPlaying]);

  // Audio tick
  const playTickSound = (highPitch = false) => {
    if (!isSoundOn) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current && AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') void ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(highPitch ? 880 : 440, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio blocked or unsupported
    }
  };

  // Calculate sprint milestone
  const simHours = Math.floor(simMinutes / 60);
  const simMins = simMinutes % 60;
  const simSeconds = Math.floor((simMinutes * 60) % 60);

  const getMilestone = (mins: number) => {
    if (mins < 60) {
      return {
        title: 'Hour 0: The Reveal',
        desc: 'Doors open. The secret twist is revealed to everyone. Teams lock in ideas.',
        tag: 'TWIST REVEALED',
      };
    }
    if (mins < 180) {
      return {
        title: 'Hour 2: The Foundation',
        desc: 'Architecture drafted. First commits pushed. Prototypes taking shape.',
        tag: 'DEEP CODE',
      };
    }
    if (mins < 300) {
      return {
        title: 'Hour 4: Mid-Sprint Momentum',
        desc: 'Halfway point. Coffee break, peer testing, overcoming the unexpected hurdles.',
        tag: 'HALFTIME PUSH',
      };
    }
    if (mins < 420) {
      return {
        title: 'Hour 6: Feature Freeze & Polish',
        desc: 'Bug squashing, UI refinement, and preparing the presentation storyline.',
        tag: 'POLISH & TEST',
      };
    }
    return {
      title: 'Hour 8: Ship It!',
      desc: 'Pencils down. 8 hours complete. Demos begin and the mystery is conquered.',
      tag: 'WE BUILT THAT',
    };
  };

  const currentMilestone = getMilestone(simMinutes);

  return (
    <div
      className={`interactive-timer-card relative rounded-3xl border border-border/80 bg-gradient-to-b from-card/90 via-card/60 to-card/90 p-6 sm:p-8 shadow-xl backdrop-blur-md max-w-4xl mx-auto my-10 overflow-hidden ${className}`}
    >
      {/* Background ambient radar glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                FREQUENCY: 88.4 MHz
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground">
              {mode === 'countdown' ? 'Blackout Mission Chronometer' : '8-Hour Sprint Simulator'}
            </h3>
          </div>
        </div>

        {/* Mode Toggle Pills & Sound Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-full bg-secondary border border-border/80">
            <button
              onClick={() => {
                setMode('countdown');
                setIsSimPlaying(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                mode === 'countdown'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>T-Minus</span>
            </button>
            <button
              onClick={() => {
                setMode('simulator');
                setSimMinutes(0);
                setIsSimPlaying(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                mode === 'simulator'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>8-Hour Sim</span>
            </button>
          </div>

          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="p-2 rounded-full border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title={isSoundOn ? 'Mute sound' : 'Enable audio ticks'}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MODE 1: LIVE T-MINUS COUNTDOWN */}
      {mode === 'countdown' && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'DAYS', val: timeLeft.days, max: 60, tag: 'REMAINING' },
              { label: 'HOURS', val: timeLeft.hours, max: 24, tag: 'IN THE DAY' },
              { label: 'MINUTES', val: timeLeft.minutes, max: 60, tag: 'TICKING' },
              { label: 'SECONDS', val: timeLeft.seconds, max: 60, tag: 'LIVE' },
            ].map((unit, idx) => {
              const pct = (unit.val / unit.max) * 100;
              const isSec = unit.label === 'SECONDS';
              return (
                <div
                  key={unit.label}
                  onClick={() => playTickSound(true)}
                  className="group relative cursor-pointer select-none rounded-2xl border border-border/80 bg-background/80 p-5 text-center shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Subtle Circular Progress indicator in corner */}
                  <div className="absolute top-3 right-3 w-5 h-5 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" className="text-border" />
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={56.5}
                        strokeDashoffset={56.5 - (56.5 * pct) / 100}
                        className={isSec ? 'text-emerald-500 transition-all duration-1000' : 'text-primary'}
                      />
                    </svg>
                  </div>

                  <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase block mb-1">
                    {unit.label}
                  </span>

                  <div className="font-display font-bold text-4xl sm:text-5xl text-foreground tracking-tight py-1 group-hover:scale-105 transition-transform">
                    {String(unit.val).padStart(2, '0')}
                  </div>

                  <span
                    className={`inline-block text-[9px] font-mono uppercase px-2 py-0.5 rounded-full mt-2 font-bold ${
                      isSec
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse'
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}
                  >
                    {unit.tag}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Footer */}
          <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span>Event kickoff is set for 09:00 AM on Hackathon Day. The twist reveals immediately.</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMode('simulator');
                  setSimMinutes(0);
                  setIsSimPlaying(true);
                }}
                className="text-xs gap-1.5 hover:border-primary"
              >
                <Zap className="w-3.5 h-3.5 text-primary" />
                Simulate 8-Hour Sprint
              </Button>
              <Button variant="hero" size="sm" onClick={onRegisterClick} className="text-xs gap-1">
                Stay Updated <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: INTERACTIVE 8-HOUR SPRINT SIMULATOR */}
      {mode === 'simulator' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Big Simulated Clock */}
            <div className="md:col-span-5 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
              <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold block mb-1">
                SPRINT CLOCK · TOTAL 8 HOURS
              </span>
              <div className="font-display font-bold text-5xl sm:text-6xl text-foreground my-2 tracking-tight">
                {String(simHours).padStart(2, '0')}:{String(simMins).padStart(2, '0')}:
                <span className="text-primary text-3xl sm:text-4xl">{String(simSeconds).padStart(2, '0')}</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {((simMinutes / 480) * 100).toFixed(0)}% SPRINT COMPLETE
              </span>

              {/* Play / Pause / Reset Controls */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSimPlaying(!isSimPlaying)}
                  className="gap-1.5 h-8 text-xs font-semibold"
                >
                  {isSimPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isSimPlaying ? 'Pause' : 'Play Sprint'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSimMinutes(0);
                    setIsSimPlaying(false);
                  }}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Reset
                </Button>
              </div>

              {/* 3D Isometric Rolling Cube Sprint Engine */}
              <div className="mt-4 pt-3 border-t border-primary/20 flex flex-col items-center">
                <IsometricCubeLoader
                  scale={0.44}
                  label={isSimPlaying ? 'SPRINT ENGINE · LIVE BLOCK ASSEMBLY' : 'SPRINT ENGINE · STANDBY'}
                />
              </div>
            </div>

            {/* Right: Milestone Story Card */}
            <div className="md:col-span-7 p-6 rounded-2xl border border-border bg-background/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                    {currentMilestone.tag}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Phase {Math.min(5, Math.floor(simMinutes / 96) + 1)} of 5
                  </span>
                </div>
                <h4 className="font-display font-semibold text-xl text-foreground mb-2">
                  {currentMilestone.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentMilestone.desc}
                </p>
              </div>

              {/* Interactive Scrub Slider */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1.5">
                  <span>00:00 (START)</span>
                  <span className="text-primary font-bold">DRAG TO SCRUB</span>
                  <span>08:00 (FINISH)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="480"
                  step="1"
                  value={simMinutes}
                  onChange={(e) => {
                    setSimMinutes(parseInt(e.target.value));
                    setIsSimPlaying(false);
                  }}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setMode('countdown')}
              className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors underline cursor-pointer"
            >
              ← Back to Live Event Countdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
