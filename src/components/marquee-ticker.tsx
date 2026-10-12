import { Sparkles, ShieldAlert, Zap, Rocket, Lock, Users } from 'lucide-react';

interface MarqueeTickerProps {
  className?: string;
}

export function MarqueeTicker({ className = '' }: MarqueeTickerProps) {
  const marqueeItemsRow1 = [
    { icon: Sparkles, text: '8 HOURS OF CREATION', tag: 'THE SPRINT' },
    { icon: ShieldAlert, text: '1 SURPRISE TWIST · NO SPOILERS', tag: 'THE SECRET' },
    { icon: Zap, text: 'BUILD. WONDER. BREAK THROUGH.', tag: 'BUILDICY' },
    { icon: Users, text: 'YOUR BEST RESOURCE? EACH OTHER', tag: 'TEAMWORK' },
    { icon: Lock, text: 'THE SECRET STAYS SEALED UNTIL DAY 1', tag: 'UNEXPECTED' },
    { icon: Rocket, text: 'CURIOUS MINDS · BOLD IDEAS', tag: 'FIRST EDITION' },
  ];

  const marqueeItemsRow2 = [
    { text: '✦ DARE TO EXPLORE', highlight: true },
    { text: 'SOMETHING IS ABOUT TO CHANGE', highlight: false },
    { text: '✦ CONDUCTED BY BUILDICY', highlight: true },
    { text: 'EIGHT HOURS TO BUILD SOMETHING REAL', highlight: false },
    { text: '✦ REVEALED ON HACKATHON DAY', highlight: true },
    { text: 'NO SPOILERS · PURE CURIOSITY', highlight: false },
  ];

  return (
    <div className={`marquee-section-container overflow-hidden py-5 select-none bg-background/80 border-y border-border/60 ${className}`}>
      {/* Row 1: Fast vibrant badges */}
      <div className="marquee-track flex gap-6 items-center whitespace-nowrap will-change-transform animate-marquee hover:[animation-play-state:paused]">
        {[...marqueeItemsRow1, ...marqueeItemsRow1].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors shadow-sm"
            >
              <Icon className="w-4 h-4 text-primary shrink-0 animate-pulse" />
              <span className="font-display font-semibold text-xs tracking-wider text-foreground">
                {item.text}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold">
                {item.tag}
              </span>
            </div>
          );
        })}
      </div>

      {/* Row 2: Reverse typography ticker */}
      <div className="marquee-track flex gap-8 items-center whitespace-nowrap will-change-transform animate-marquee-reverse mt-2.5 opacity-80 hover:[animation-play-state:paused]">
        {[...marqueeItemsRow2, ...marqueeItemsRow2].map((item, idx) => (
          <div key={idx} className="inline-flex items-center gap-3">
            <span
              className={`font-display text-xs uppercase tracking-widest ${
                item.highlight ? 'text-primary font-bold' : 'text-muted-foreground font-medium'
              }`}
            >
              {item.text}
            </span>
            <span className="text-primary/40 text-xs">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
