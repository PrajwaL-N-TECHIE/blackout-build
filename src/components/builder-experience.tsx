import { useState, useRef, useEffect, MouseEvent } from 'react';
import { Sparkles, Rocket, Zap, Users, Trophy, Radio, ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playStickerPop } from '@/lib/chime';
import buildicyLogo from '@/assets/buildicy-logo.png';

interface BuilderExperienceProps {
  onRegisterClick: () => void;
}

const BUILDER_ROLES = [
  {
    id: 'hacker',
    icon: Zap,
    name: 'The Hacker',
    tag: 'CODE SPRINT',
    color: 'oklch(0.91 0.16 117)', // Lime
    desc: 'Turns fresh ideas into production code in 8 hours flat. Loves fast iterations and zero merge conflicts.',
  },
  {
    id: 'designer',
    icon: Sparkles,
    name: 'The Designer',
    tag: 'PIXEL POLISH',
    color: 'oklch(0.75 0.18 300)', // Violet
    desc: 'Crafts high-craft visual interfaces and seamless interactions that make everyone say "who made that?".',
  },
  {
    id: 'strategist',
    icon: Radio,
    name: 'The Strategist',
    tag: 'TWIST CRACKER',
    color: 'oklch(0.82 0.14 173)', // Teal
    desc: 'The first to dissect the surprise twist when it drops. Keeps the team focused on what delivers maximum impact.',
  },
  {
    id: 'visionary',
    icon: Trophy,
    name: 'The Visionary',
    tag: 'STORYTELLER',
    color: 'oklch(0.85 0.18 80)', // Amber
    desc: 'Brings the team together, connects the dots, and articulates the vision during final project showcases.',
  },
];

export function BuilderExperience({ onRegisterClick }: BuilderExperienceProps) {
  const [selectedRole, setSelectedRole] = useState<(typeof BUILDER_ROLES)[number]>(BUILDER_ROLES[0]!);
  const [bouncingSticker, setBouncingSticker] = useState<string | null>(null);

  // Parallax board mouse tracking
  const boardRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mouse tilt on the sticker board
  const handleBoardMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    board.style.setProperty('--board-tilt-x', `${y * -16}deg`);
    board.style.setProperty('--board-tilt-y', `${x * 18}deg`);
    board.style.setProperty('--board-shift-x', `${x * 12}px`);
    board.style.setProperty('--board-shift-y', `${y * 12}px`);
  };

  const handleBoardMouseLeave = () => {
    const board = boardRef.current;
    if (!board) return;
    board.style.setProperty('--board-tilt-x', '0deg');
    board.style.setProperty('--board-tilt-y', '0deg');
    board.style.setProperty('--board-shift-x', '0px');
    board.style.setProperty('--board-shift-y', '0px');
  };

  // Spotlight card mouse tracking
  const handleCardMouseMove = (e: MouseEvent<HTMLDivElement>, idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const triggerStickerClick = (id: string, pitch = 500) => {
    playStickerPop(pitch);
    setBouncingSticker(id);
    setTimeout(() => {
      setBouncingSticker((curr) => (curr === id ? null : curr));
    }, 450);
  };

  return (
    <div className="section-inner">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Interactive Multi-Layer Sticker Board */}
        <div className="lg:col-span-5 reveal">
          <div
            ref={boardRef}
            onMouseMove={handleBoardMouseMove}
            onMouseLeave={handleBoardMouseLeave}
            className="builder-board-wrapper relative min-h-[460px] flex items-center justify-center p-4 rounded-3xl bg-card/25 border border-primary/15 backdrop-blur-sm shadow-inner transition-transform duration-300 ease-out"
            style={{ perspective: 1000 }}
          >
            {/* Ambient background constellation dots & tape */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl" aria-hidden="true">
              <div className="board-grid-pattern absolute inset-0 opacity-15" />
              <div className="absolute top-4 left-6 w-24 h-5 bg-paper/60 border border-night/10 rounded-sm -rotate-6 shadow-sm flex items-center justify-center text-[9px] font-mono font-bold tracking-widest text-night/70">
                ✦ BUILDICY LABS
              </div>
              <div className="absolute bottom-5 right-6 w-28 h-5 bg-lime/60 border border-night/10 rounded-sm rotate-3 shadow-sm flex items-center justify-center text-[9px] font-mono font-bold tracking-wider text-night">
                8H SPRINT 2026
              </div>
            </div>

            {/* Sticker 1: Main "WHAT IF?" Card */}
            <div
              onClick={() => triggerStickerClick('what-if', 520)}
              className={`offline-sticker z-10 cursor-pointer select-none transition-all duration-300 ${
                bouncingSticker === 'what-if' ? 'scale-105 rotate-3' : 'hover:scale-105 hover:rotate-[-4deg]'
              }`}
              title="Click for a sound!"
            >
              <Rocket className="w-14 h-14 text-lime" />
              <strong className="text-3xl font-display font-bold text-lime mt-3">WHAT IF?</strong>
              <span className="text-[11px] font-mono tracking-widest text-paper/90 mt-1">
                LET CURIOSITY LEAD.
              </span>
            </div>

            {/* Sticker 2: Top-Left Floating Buildicy Beacon Emblem */}
            <div
              onClick={() => triggerStickerClick('beacon-pin', 650)}
              className={`absolute -top-3 -left-2 z-20 cursor-pointer select-none bg-paper border-4 border-night rounded-2xl p-2.5 shadow-xl flex items-center gap-2.5 transition-transform duration-300 ${
                bouncingSticker === 'beacon-pin' ? 'scale-115 -rotate-12' : '-rotate-6 hover:scale-110 hover:rotate-0'
              }`}
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                <img src={buildicyLogo} alt="Buildicy Pin" className="w-7 h-7 object-contain" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
              </div>
              <div className="text-left">
                <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-primary">
                  BEACON LOCKED
                </div>
                <div className="text-[11px] font-display font-bold text-night">88.4 MHz</div>
              </div>
            </div>

            {/* Sticker 3: Top-Right "THE TWIST · DAY 1" Stamp */}
            <div
              onClick={() => triggerStickerClick('twist-stamp', 440)}
              className={`absolute top-4 -right-3 z-20 cursor-pointer select-none bg-card border-3 border-primary/40 rounded-full w-24 h-24 p-2 shadow-lg flex flex-col items-center justify-center text-center transition-transform duration-300 ${
                bouncingSticker === 'twist-stamp' ? 'scale-115 rotate-15' : 'rotate-12 hover:scale-110 hover:rotate-6'
              }`}
            >
              <ShieldAlert className="w-5 h-5 text-primary mb-0.5" />
              <span className="text-[9px] font-mono font-extrabold text-foreground uppercase tracking-wider leading-tight">
                TOP SECRET
              </span>
              <span className="text-[8px] font-mono text-muted-foreground tracking-tighter">
                NO SPOILERS
              </span>
            </div>

            {/* Sticker 4: Bottom-Left "SHIP IT" Washi Tape */}
            <div
              onClick={() => triggerStickerClick('ship-tape', 580)}
              className={`absolute -bottom-4 left-4 z-20 cursor-pointer select-none bg-lime text-night font-mono font-black text-xs px-3.5 py-1.5 rounded-md border-2 border-night shadow-md tracking-wider transition-transform duration-300 ${
                bouncingSticker === 'ship-tape' ? 'scale-110 rotate-6' : '-rotate-4 hover:scale-110 hover:rotate-0'
              }`}
            >
              ⚡ WE BUILT THAT 🚀
            </div>

            {/* Sticker 5: Bottom-Right "TEAMWORK" Hologram Pill */}
            <div
              onClick={() => triggerStickerClick('team-pill', 720)}
              className={`absolute -bottom-2 -right-2 z-20 cursor-pointer select-none bg-night text-paper font-display font-bold text-xs px-3.5 py-2 rounded-2xl border-2 border-paper shadow-xl flex items-center gap-1.5 transition-transform duration-300 ${
                bouncingSticker === 'team-pill' ? 'scale-110 -rotate-8' : 'rotate-6 hover:scale-110 hover:rotate-0'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-lime" />
              <span>SQUAD READY</span>
            </div>

            {/* Decorative Sparkles */}
            <Sparkles className="art-spark one absolute top-8 right-12 text-primary w-8 h-8 pointer-events-none animate-pulse" />
            <Sparkles className="art-spark two absolute bottom-12 left-10 text-primary w-6 h-6 pointer-events-none" />
          </div>

          <div className="text-center mt-3">
            <span className="text-[11px] font-mono text-muted-foreground/80 tracking-wide">
              ✦ Click any badge for tactile sound feedback ✦
            </span>
          </div>
        </div>

        {/* Right Column: Copy + Builder Pillars + Archetype Picker */}
        <div className="lg:col-span-7 reveal space-y-6">
          <div>
            <div className="eyebrow">
              <Sparkles className="text-primary" /> BUILT FOR THE BUILDERS
            </div>
            <h2 className="section-title">
              Your best resource?
              <br />
              <em>Each other.</em>
            </h2>
            <p className="body-copy mt-3">
              Every great idea starts somewhere. Swap ideas, tackle the unexpected, and discover what
              happens when your team takes a leap together.
            </p>
            <p className="body-copy mt-2">
              More experimenting. More creating. Something you can proudly say:{' '}
              <strong>we built that.</strong>
            </p>
          </div>

          {/* 3 Interactive Spotlight Hacker Journey Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            {[
              {
                step: '01',
                tag: 'THE HUDDLE',
                title: 'Brainstorm',
                desc: 'Bounce wild ideas, rally your crew, and pick a concept worth building.',
                icon: Users,
              },
              {
                step: '02',
                tag: 'THE TWIST',
                title: 'Adapt Fast',
                desc: 'When the mystery rule drops, turn constraints into your creative weapon.',
                icon: Zap,
              },
              {
                step: '03',
                tag: 'THE SPRINT',
                title: 'Ship & Demo',
                desc: '8 intense hours. Leave with a tangible build and pride in what you created.',
                icon: Rocket,
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onMouseMove={(e) => handleCardMouseMove(e, idx)}
                  className="spotlight-card group relative p-4 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 overflow-hidden"
                >
                  <div className="spotlight-radial absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                      {pillar.tag}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-muted-foreground/60">
                      {pillar.step}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-display font-semibold text-base text-foreground">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Interactive "Find Your Builder Superpower" Archetype Widget */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border/90 bg-card/60 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> What's your builder superpower?
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Team Chemistry: 100%
              </span>
            </div>

            {/* Role Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BUILDER_ROLES.map((role) => {
                const isSelected = selectedRole.id === role.id;
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      playStickerPop(600);
                      setSelectedRole(role);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-display font-semibold transition-all duration-200 border text-left ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-102'
                        : 'bg-background/80 hover:bg-muted text-foreground border-border hover:border-primary/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{role.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Role Dynamic Callout */}
            <div className="mt-3.5 p-3 rounded-xl bg-background/70 border border-border flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-foreground">
                  {selectedRole.name} [{selectedRole.tag}]:
                </span>{' '}
                <span className="text-muted-foreground">{selectedRole.desc}</span>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={onRegisterClick}
              className="group font-display font-semibold shadow-sm hover:border-primary hover:bg-card"
            >
              Find your next adventure{' '}
              <ArrowUpRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
