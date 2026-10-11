import { useEffect, useRef, useState } from 'react';
import { Lightbulb, LightbulbOff, Camera, Rocket, Music2, VolumeX, LockKeyhole, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FishFollower() {
  const fish = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return;
    let targetX = window.innerWidth * .82, targetY = 220;
    let x = targetX, y = targetY, angle = 0, frame = 0;
    const move = (event: PointerEvent) => { targetX = event.clientX + 35; targetY = event.clientY + 35; };
    const swim = () => {
      const dx = targetX - x, dy = targetY - y;
      x += dx * .045; y += dy * .045;
      if (Math.hypot(dx,dy) > 3) angle = Math.atan2(dy,dx) * 180 / Math.PI;
      fish.current?.style.setProperty('--fish-x', `${x}px`);
      fish.current?.style.setProperty('--fish-y', `${y}px`);
      fish.current?.style.setProperty('--fish-angle', `${angle}deg`);
      frame = requestAnimationFrame(swim);
    };
    window.addEventListener('pointermove',move); frame = requestAnimationFrame(swim);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove',move); };
  },[]);
  return <div ref={fish} className="fish-follower" aria-hidden="true"><svg viewBox="0 0 120 75"><g className="fish-tail"><path d="M42 37 8 12 15 38 8 63Z" fill="var(--fish-fin)" stroke="var(--paper)" strokeWidth="3" /></g><path d="M44 25 61 8 76 29M48 49 61 66 78 47" fill="var(--fish-fin)" stroke="var(--paper)" strokeWidth="2" /><ellipse cx="68" cy="37" rx="36" ry="23" fill="var(--fish-body)" stroke="var(--paper)" strokeWidth="3" /><path d="M57 24Q48 37 57 50M69 26Q60 37 69 48" fill="none" stroke="var(--fish-fin)" strokeWidth="3" /><circle cx="87" cy="31" r="7" fill="var(--paper)" /><circle cx="90" cy="31" r="3" fill="var(--night)" /><path d="M98 41Q91 47 85 43" fill="none" stroke="var(--night)" strokeWidth="2" /></svg></div>;
}

export function SceneToys() {
  const [dark,setDark] = useState(false);
  const [flash,setFlash] = useState(false);
  const [launch,setLaunch] = useState(false);
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
  return <>
    <div className={`hero-night ${dark ? 'is-dark' : ''}`} aria-hidden="true"><div className="night-stars" /></div>
    <div className={`camera-flash ${flash ? 'is-flashing' : ''}`} aria-hidden="true" />
    <div className={`toy-rocket ${launch ? 'is-launched' : ''}`} aria-hidden="true"><Rocket /></div>
    <div className="scene-tools" aria-label="Landscape interactions">
      <Button variant="scenery" size="icon" aria-label={dark ? 'Turn lights on' : 'Turn lights off'} title={dark ? 'Turn lights on' : 'Turn lights off'} aria-pressed={dark} onClick={() => setDark(!dark)}>{dark ? <LightbulbOff /> : <Lightbulb />}</Button>
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