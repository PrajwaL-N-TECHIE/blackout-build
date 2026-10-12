import { useEffect, useRef, useState } from 'react';
import { Lightbulb, LightbulbOff, Camera, Rocket, Music2, VolumeX, LockKeyhole, Sparkles, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playStickerPop } from '@/lib/chime';

export function FishFollower() {
  const fish = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<number[]>([]);

  const handleFishClick = () => {
    playStickerPop(640);
    const id = Date.now();
    setBubbles((prev) => [...prev.slice(-4), id]);
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b !== id));
    }, 1200);
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return;
    let targetX = window.innerWidth * 0.82,
      targetY = 220;
    let x = targetX,
      y = targetY,
      angle = 0,
      frame = 0;
    const move = (event: PointerEvent) => {
      targetX = event.clientX + 35;
      targetY = event.clientY + 25;
    };
    const swim = () => {
      const dx = targetX - x,
        dy = targetY - y;
      x += dx * 0.048;
      y += dy * 0.048;
      if (Math.hypot(dx, dy) > 3) {
        angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      }
      // Never swim upside down when facing left:
      const isFacingLeft = Math.abs(angle) > 90;
      const flipY = isFacingLeft ? -1 : 1;

      fish.current?.style.setProperty('--fish-x', `${x}px`);
      fish.current?.style.setProperty('--fish-y', `${y}px`);
      fish.current?.style.setProperty('--fish-angle', `${angle}deg`);
      fish.current?.style.setProperty('--fish-flip-y', `${flipY}`);
      frame = requestAnimationFrame(swim);
    };
    window.addEventListener('pointermove', move, { passive: true });
    frame = requestAnimationFrame(swim);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  return (
    <div
      ref={fish}
      onClick={handleFishClick}
      className="fish-follower select-none pointer-events-auto cursor-pointer will-change-transform"
      title="✦ Click the fish companion to blow bubbles!"
      aria-hidden="true"
    >
      <div className="relative w-full h-full">
        {/* Animated bubble burst on click */}
        {bubbles.map((id) => (
          <div
            key={id}
            className="absolute top-4 -right-2 pointer-events-none flex gap-1 animate-fadeIn"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-sky-200/90 border border-white animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300/80 animate-ping delay-75" />
          </div>
        ))}

        <svg viewBox="0 0 130 75" className="filter drop-shadow-md w-full h-full overflow-visible">
          <defs>
            <linearGradient id="fishGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--fish-body)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="var(--fish-fin)" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="finGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--fish-fin)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--fish-body)" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Caudal Tail fin with realistic organic flutter */}
          <g className="fish-tail">
            <path
              d="M38 37 C26 22, 12 10, 4 14 C8 24, 18 34, 12 37 C18 40, 8 50, 4 60 C12 64, 26 52, 38 37 Z"
              fill="url(#finGlowGrad)"
              stroke="var(--paper)"
              strokeWidth="2"
            />
            <path d="M30 37 C20 28, 14 20, 8 18" stroke="var(--paper)" strokeWidth="1" strokeOpacity="0.7" fill="none" />
            <path d="M30 37 C20 46, 14 54, 8 56" stroke="var(--paper)" strokeWidth="1" strokeOpacity="0.7" fill="none" />
          </g>

          {/* Elegant Dorsal & Ventral Fins */}
          <path
            d="M48 24 C56 12, 70 8, 82 22 C72 23, 58 24, 48 24 Z"
            fill="url(#finGlowGrad)"
            stroke="var(--paper)"
            strokeWidth="1.5"
          />
          <path
            d="M52 50 C60 62, 72 64, 80 52 C70 51, 60 50, 52 50 Z"
            fill="url(#finGlowGrad)"
            stroke="var(--paper)"
            strokeWidth="1.5"
          />

          {/* Streamlined Hydrodynamic Body */}
          <path
            d="M106 37 C100 24, 76 17, 46 22 C32 25, 24 33, 20 37 C24 41, 32 49, 46 52 C76 57, 100 50, 106 37 Z"
            fill="url(#fishGlowGrad)"
            stroke="var(--paper)"
            strokeWidth="2.5"
          />

          {/* Pectoral Fin with subtle sweep */}
          <path
            d="M72 38 C62 44, 52 46, 46 44 C50 39, 60 38, 72 38 Z"
            fill="var(--fish-fin)"
            stroke="var(--paper)"
            strokeWidth="1.5"
            opacity="0.85"
          />

          {/* Lateral Bioluminescent Photophores */}
          <circle cx="42" cy="37" r="1.5" fill="var(--lime)" opacity="0.8" />
          <circle cx="52" cy="36" r="1.8" fill="var(--lime)" opacity="0.9" />
          <circle cx="63" cy="35" r="2" fill="var(--lime)" opacity="1" />
          <circle cx="74" cy="34" r="1.8" fill="var(--lime)" opacity="0.9" />
          <circle cx="84" cy="34" r="1.5" fill="var(--lime)" opacity="0.8" />

          {/* Natural Realistic Aquatic Eye (No smile, authentic natural aquatic pupil) */}
          <circle cx="94" cy="33" r="5" fill="var(--night)" stroke="var(--paper)" strokeWidth="1.5" />
          <circle cx="94" cy="33" r="3" fill="#0ea5e9" />
          <circle cx="95" cy="32" r="1.2" fill="#ffffff" />

          {/* Natural streamlined snout contour */}
          <path d="M106 37 L102 37" stroke="var(--night)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

export function SceneToys() {
  const [dark,setDark] = useState(false);
  const [flash,setFlash] = useState(false);
  const [launch,setLaunch] = useState(false);
  const [ping,setPing] = useState(false);
  const [playing,setPlaying] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => { timers.current.forEach(clearTimeout); void audio.current?.close(); },[]);
  const music = async () => {
    if (playing) { await audio.current?.close(); audio.current = null; setPlaying(false); return; }
    const context = new AudioContext(); audio.current = context; await context.resume();
    [261.63,329.63,392].forEach(frequency => {
      const oscillator = context.createOscillator(), gain = context.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.018, context.currentTime);
      oscillator.connect(gain); gain.connect(context.destination); oscillator.start();
    }); setPlaying(true);
  };
  const sonarPing = () => {
    setPing(true);
    timers.current.push(setTimeout(() => setPing(false), 1400));
    try {
      const ctx = audio.current || new AudioContext();
      if (!audio.current) audio.current = ctx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.25);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    } catch {
      // Audio unsupported or blocked
    }
  };
  return <>
    <div className={`hero-night ${dark ? 'is-dark' : ''}`} aria-hidden="true">
      <div className="night-stars" />
      <div className="shooting-star" />
      <div className="shooting-star" />
    </div>
    <div className={`camera-flash ${flash ? 'is-flashing' : ''}`} aria-hidden="true" />
    <div className={`toy-rocket ${launch ? 'is-launched' : ''}`} aria-hidden="true"><Rocket /></div>
    {ping && <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center"><div className="beacon-sonar-ping !w-[600px] !h-[600px]" /></div>}
    <div className="scene-tools" aria-label="Landscape interactions">
      <Button variant="scenery" size="icon" aria-label={dark ? 'Turn lights on' : 'Turn lights off'} title={dark ? 'Turn lights on' : 'Turn lights off'} aria-pressed={dark} onClick={() => setDark(!dark)}>{dark ? <LightbulbOff /> : <Lightbulb />}</Button>
      <Button variant="scenery" size="icon" aria-label="Send radar beacon ping" title="Send radar beacon ping" onClick={sonarPing}><Radio className={ping ? 'animate-spin text-emerald-400' : ''} /></Button>
      <Button variant="scenery" size="icon" aria-label="Take a snapshot" title="Take a snapshot" onClick={() => { setFlash(true); timers.current.push(setTimeout(() => setFlash(false),650)); }}><Camera /></Button>
      <Button variant="scenery" size="icon" aria-label={playing ? 'Stop ambient sound' : 'Play ambient sound'} title={playing ? 'Stop ambient sound' : 'Play ambient sound'} aria-pressed={playing} onClick={() => void music()}>{playing ? <VolumeX /> : <Music2 />}</Button>
      <Button variant="scenery" size="icon" aria-label="Launch the rocket" title="Launch the rocket" disabled={launch} onClick={() => { setLaunch(true); timers.current.push(setTimeout(() => setLaunch(false),2200)); }}><Rocket /></Button>
    </div>
  </>;
}

export function BlackoutJourney() {
  const section = useRef<HTMLElement>(null);
  const [sealed,setSealed] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const node = section.current; if (!node) return;
        const bounds = node.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1,-bounds.top / (bounds.height - window.innerHeight)));
        node.style.setProperty('--journey', `${progress}`);
        node.style.setProperty('--journey-angle', `${progress * 330 - 18}deg`);
        node.style.setProperty('--journey-shift', `${progress * -90}px`);
        node.style.setProperty('--journey-dark', `${Math.min(1,progress * 1.8)}`);
      });
    };
    update(); window.addEventListener('scroll',update,{passive:true}); window.addEventListener('resize',update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll',update); window.removeEventListener('resize',update); };
  },[]);
  return <section ref={section} className="blackout-journey" id="format"><div className="journey-sticky">
    <div className="journey-grid" aria-hidden="true" /><div className="journey-curtain" aria-hidden="true" /><div className="journey-stars" aria-hidden="true" />
    <div className="journey-content"><div className="eyebrow"><Sparkles /> EXPECT THE UNEXPECTED</div><h2>Something is<br />about to <em>change.</em></h2><p>Eight hours. One surprise.<br />The rest? You’ll find out when we begin.</p>
      <Button variant="scenery" className="sealed-button" onClick={() => setSealed(true)}><LockKeyhole />{sealed ? 'Nice try. Event day only.' : 'The secret stays sealed'}<span aria-hidden="true">↗</span></Button>
      <div className="seal-status" role="status">{sealed ? 'Some things are worth waiting for.' : 'THE REVEAL · AT THE START OF HACKATHON DAY'}</div>
    </div>
    <div className="journey-disc" aria-hidden="true"><div className="disc-grooves" /><div className="disc-label"><Sparkles /><span>BUILDICY</span></div></div>
    <div className="journey-orbit" aria-hidden="true"><span>✦</span><span>✦</span><span>✦</span></div>
    <div className="journey-progress" aria-hidden="true"><span /></div>
  </div></section>;
}