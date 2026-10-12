import { useState, useRef, useEffect } from 'react';
import { Disc3, Play, Pause, Volume2, VolumeX, Sparkles, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import buildicyLogo from '@/assets/buildicy-logo.png';
import { playStickerPop } from '@/lib/chime';

export function TurntablePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rpm, setRpm] = useState<'33' | '45'>('33');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRefs = useRef<OscillatorNode[]>([]);

  const togglePlayback = async () => {
    playStickerPop(isPlaying ? 400 : 650);

    if (isPlaying) {
      // Stop audio
      oscRefs.current.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignore
        }
      });
      oscRefs.current = [];
      if (audioCtxRef.current) {
        void audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlaying(false);
    } else {
      // Start ambient vintage vinyl sound
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;
          if (ctx.state === 'suspended') {
            await ctx.resume();
          }

          // Gentle ambient vinyl lo-fi harmonic chord (F maj7 / C)
          const notes = rpm === '33' ? [174.61, 220.0, 261.63, 329.63] : [220.0, 261.63, 329.63, 392.0];
          notes.forEach((freq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(0.012, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            oscRefs.current.push(osc);
          });
        }
      } catch {
        // Audio error or blocked
      }
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      oscRefs.current.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignore
        }
      });
      if (audioCtxRef.current) {
        void audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 rounded-3xl bg-card/80 border border-primary/20 backdrop-blur-md shadow-xl overflow-hidden">
      {/* Decorative ambient background rings */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full border border-primary/10 pointer-events-none" />
      <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full border border-primary/15 pointer-events-none" />

      {/* Turntable Hardware Deck */}
      <div className="relative flex flex-col items-center">
        {/* Chassis */}
        <div className="relative w-72 h-64 sm:w-80 sm:h-72 rounded-2xl bg-gradient-to-br from-[#dc2626] to-[#991b1b] p-4 shadow-2xl border-4 border-[#b91c1c] flex items-center justify-center">
          {/* Deck Platter */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-[#18181b] border-4 border-[#27272a] shadow-inner flex items-center justify-center">
            {/* Spinning Vinyl Record Disc */}
            <div
              className={`relative w-[92%] h-[92%] rounded-full bg-[#09090b] shadow-2xl flex items-center justify-center cursor-pointer select-none transition-transform ${
                isPlaying
                  ? rpm === '33'
                    ? 'animate-spin-vinyl-33'
                    : 'animate-spin-vinyl-45'
                  : 'hover:scale-[1.02]'
              }`}
              onClick={togglePlayback}
              title="Click vinyl to play or pause"
            >
              {/* Vinyl Grooves concentric rings */}
              <div className="absolute inset-2 rounded-full border border-zinc-800/80 pointer-events-none" />
              <div className="absolute inset-5 rounded-full border border-zinc-800/70 pointer-events-none" />
              <div className="absolute inset-8 rounded-full border border-zinc-800/60 pointer-events-none" />
              <div className="absolute inset-11 rounded-full border border-zinc-800/50 pointer-events-none" />
              <div className="absolute inset-14 rounded-full border border-zinc-800/40 pointer-events-none" />

              {/* Vinyl Sheen Light Reflection */}
              <div
                className="absolute inset-0 rounded-full opacity-20 pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 45deg, transparent 0deg, white 45deg, transparent 90deg, transparent 180deg, white 225deg, transparent 270deg)',
                }}
              />

              {/* Center Record Label - Buildicy Beacon */}
              <div className="relative w-20 h-20 rounded-full bg-lime border-4 border-paper shadow-md flex flex-col items-center justify-center text-center p-1">
                <img src={buildicyLogo} alt="Buildicy Logo" className="w-6 h-6 object-contain" />
                <span className="text-[7.5px] font-mono font-black text-night uppercase tracking-wider mt-0.5">
                  BLACKOUT 8H
                </span>
                <span className="text-[6.5px] font-mono text-night/80 font-bold">SIDE A · {rpm} RPM</span>
                <div className="w-2.5 h-2.5 rounded-full bg-night mt-0.5 border border-paper" />
              </div>
            </div>

            {/* Tonearm with needle */}
            <div
              className={`absolute top-2 right-2 w-20 h-32 pointer-events-none transition-transform duration-700 origin-top-right ${
                isPlaying ? 'rotate-[26deg]' : 'rotate-0'
              }`}
            >
              <div className="absolute top-1 right-2 w-6 h-6 rounded-full bg-zinc-300 border-2 border-zinc-500 shadow-md" />
              <div className="absolute top-6 right-4 w-1.5 h-24 bg-gradient-to-b from-zinc-200 via-zinc-400 to-zinc-600 rounded-full shadow" />
              <div className="absolute bottom-1 right-4.5 w-3.5 h-6 bg-zinc-800 rounded-sm border border-zinc-400 shadow transform -rotate-12" />
            </div>
          </div>

          {/* Turntable Power Switch & Controls on the Deck */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <button
              onClick={togglePlayback}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-md transition-all ${
                isPlaying
                  ? 'bg-emerald-400 text-night ring-2 ring-white scale-105'
                  : 'bg-zinc-800 text-paper hover:bg-zinc-700'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/20 text-[9px] font-mono font-bold text-white">
              <button
                onClick={() => setRpm('33')}
                className={`px-1.5 py-0.5 rounded ${rpm === '33' ? 'bg-white text-black' : 'opacity-70'}`}
              >
                33
              </button>
              <button
                onClick={() => setRpm('45')}
                className={`px-1.5 py-0.5 rounded ${rpm === '45' ? 'bg-white text-black' : 'opacity-70'}`}
              >
                45
              </button>
            </div>
          </div>
        </div>

        <span className="text-[11px] font-mono text-muted-foreground mt-2 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-primary" /> Click the vinyl or switch to spin & play
        </span>
      </div>

      {/* Information & Floating Satellite Vinyls */}
      <div className="flex-1 space-y-4 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono font-bold uppercase tracking-wider">
          <Music className="w-3.5 h-3.5 animate-pulse" /> ROTATING HACKER CHRONOMETER
        </div>

        <h3 className="text-2xl sm:text-3xl font-display font-semibold text-foreground">
          Tune into the <em>Blackout Groove</em>
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Inspired by the timeless vinyl tradition of Hack The North. When the hackathon kicks off,
          the needle drops on an 8-hour sprint of coding, designing, and conquering the surprise twist.
        </p>

        {/* 2 Satellite Floating Vinyl Discs (Just like Hack The North Screenshot 3) */}
        <div className="flex items-center gap-4 pt-1">
          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-background/80 border border-border shadow-sm">
            <div className={`w-10 h-10 rounded-full bg-night border-2 border-lime flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
              <Disc3 className="w-6 h-6 text-lime" />
            </div>
            <div className="text-xs">
              <div className="font-display font-bold text-foreground">Track 01</div>
              <div className="text-[10px] font-mono text-muted-foreground">The 8-Hour Sprint</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-background/80 border border-border shadow-sm">
            <div className={`w-10 h-10 rounded-full bg-night border-2 border-primary flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
              <Disc3 className="w-6 h-6 text-primary" />
            </div>
            <div className="text-xs">
              <div className="font-display font-bold text-foreground">Track 02</div>
              <div className="text-[10px] font-mono text-muted-foreground">The Secret Reveal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
