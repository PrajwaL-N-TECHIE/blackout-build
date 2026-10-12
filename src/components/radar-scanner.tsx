import { useState, useRef, useEffect } from 'react';
import { Radio, Volume2, VolumeX, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RadarSignalScanner() {
  const [frequency, setFrequency] = useState(76.2);
  const [isLocked, setIsLocked] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const TARGET_FREQ = 88.4;
  const isNearTarget = Math.abs(frequency - TARGET_FREQ) < 0.8;

  // Detect lock
  useEffect(() => {
    if (Math.abs(frequency - TARGET_FREQ) < 0.2) {
      setIsLocked(true);
    } else {
      setIsLocked(false);
    }
  }, [frequency]);

  // Audio tone generation for frequency tuning
  useEffect(() => {
    if (!isAudioOn) {
      if (audioCtxRef.current) {
        void audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return undefined;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current && AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return undefined;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pitch changes with frequency, sweet tone when locked
      const pitch = isNearTarget ? 440 : 200 + (frequency - 70) * 8;
      osc.type = isNearTarget ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);

      gain.gain.setValueAtTime(isNearTarget ? 0.03 : 0.008, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      return () => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      };
    } catch {
      // Audio permission or unsupported
      return undefined;
    }
  }, [frequency, isAudioOn, isNearTarget]);

  // Waveform oscilloscope canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let frameId = 0;
    let step = 0;

    const renderWave = () => {
      step += isNearTarget ? 0.08 : 0.2;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = 'rgba(120, 100, 200, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Signal wave
      ctx.beginPath();
      ctx.lineWidth = isLocked ? 2.5 : 1.5;
      ctx.strokeStyle = isLocked ? '#10b981' : isNearTarget ? '#a855f7' : '#64748b';

      for (let x = 0; x < width; x++) {
        const freqMultiplier = isNearTarget ? 0.04 : 0.12;
        const noise = isNearTarget ? 0 : (Math.random() - 0.5) * 8;
        const y = height / 2 + Math.sin(x * freqMultiplier + step) * (isNearTarget ? 18 : 8) + noise;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      frameId = requestAnimationFrame(renderWave);
    };

    frameId = requestAnimationFrame(renderWave);
    return () => cancelAnimationFrame(frameId);
  }, [isNearTarget, isLocked]);

  return (
    <div className="radar-scanner-gadget p-6 rounded-3xl border border-border/80 bg-card/90 shadow-xl backdrop-blur-md relative overflow-hidden max-w-lg mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground">
              Buildicy Signal Receiver
            </h4>
            <p className="text-[10px] font-mono text-muted-foreground uppercase">
              Tune to 88.4 MHz for transmission
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAudioOn(!isAudioOn)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary"
          title={isAudioOn ? 'Mute frequency audio' : 'Unmute frequency audio'}
        >
          {isAudioOn ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Oscilloscope Screen */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-slate-950/80 p-2 shadow-inner">
        <canvas ref={canvasRef} width={380} height={90} className="w-full h-[90px] block" />

        {/* Status overlay */}
        <div className="absolute top-2 right-3 font-mono text-[10px] flex items-center gap-1.5">
          {isLocked ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
              <CheckCircle2 className="w-3 h-3" /> BEACON LOCKED
            </span>
          ) : isNearTarget ? (
            <span className="text-purple-400 animate-pulse bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/40">
              SIGNAL APPROACHING...
            </span>
          ) : (
            <span className="text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-full">
              SEARCHING...
            </span>
          )}
        </div>
      </div>

      {/* Frequency Tuning Slider */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
          <span className="text-muted-foreground flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" /> TUNER DIAL
          </span>
          <span className="text-foreground font-bold text-sm bg-secondary px-2.5 py-0.5 rounded-md border border-border">
            {frequency.toFixed(1)} <span className="text-primary text-[10px]">MHz</span>
          </span>
        </div>

        <input
          type="range"
          min="70.0"
          max="108.0"
          step="0.1"
          value={frequency}
          onChange={(e) => setFrequency(parseFloat(e.target.value))}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />

        <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1 px-1">
          <span>70.0</span>
          <span className="text-primary font-semibold">88.4 (BEACON)</span>
          <span>108.0</span>
        </div>
      </div>

      {/* Decoded Secret Transmission Box */}
      {isLocked && (
        <div className="mt-4 p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 animate-fade-in text-xs font-mono text-emerald-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-spin" />
          <div className="leading-relaxed">
            <strong className="block text-emerald-200 uppercase tracking-wider mb-0.5">
              Decrypted Transmission:
            </strong>
            "Buildicy Blackout confirmed. 8 hours of creation. One unexpected twist revealed on day 1. Bring your team, no spoilers."
          </div>
        </div>
      )}

      {/* Quick Snap Button */}
      {!isLocked && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setFrequency(88.4)}
            className="text-[11px] font-mono text-primary/80 hover:text-primary underline cursor-pointer transition-colors"
          >
            Auto-tune to 88.4 MHz
          </button>
        </div>
      )}
    </div>
  );
}
