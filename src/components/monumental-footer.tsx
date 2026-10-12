import { useState, useRef, MouseEvent } from 'react';
import {
  ArrowUpRight,
  Code2,
  Palette,
  Cpu,
  Brain,
  Twitter,
  Github,
  Linkedin,
  MessageSquare,
  ArrowUp,
  MapPin,
  Sparkles,
  Zap,
} from 'lucide-react';
import { playStickerPop } from '@/lib/chime';
import { ParallaxStarfield } from '@/components/parallax-starfield';

interface MonumentalFooterProps {
  onRegisterClick: () => void;
}

export function MonumentalFooter({ onRegisterClick }: MonumentalFooterProps) {
  const [activeBadge, setActiveBadge] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const brandRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!brandRef.current) return;
    const rect = brandRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleBadgeClick = (name: string, pitch: number) => {
    setActiveBadge(name);
    playStickerPop(pitch);
    setTimeout(() => setActiveBadge(null), 1500);
  };

  const scrollToTop = () => {
    playStickerPop(780);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const badges = [
    { name: 'Code', icon: Code2, pitch: 520 },
    { name: 'Design', icon: Palette, pitch: 580 },
    { name: 'Hardware', icon: Cpu, pitch: 640 },
    { name: 'AI Logic', icon: Brain, pitch: 700 },
  ];

  return (
    <footer
      className="relative w-full bg-[#03060f] text-white pt-20 pb-12 overflow-hidden border-t border-white/10 select-none"
      aria-label="Buildicy Blackout Portal Footer"
    >
      {/* Deep Space Background Atmosphere & Radial Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Multi-Depth Cosmic Starfield */}
        <ParallaxStarfield className="opacity-35" />

        {/* Soft Ambient Violet Spotlight at Bottom Center (like 27X.ai) */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-t from-purple-600/30 via-violet-600/15 to-transparent blur-[120px] rounded-full" />
        {/* Subtle Cyan Rim Highlight on the Left */}
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-sky-500/10 blur-[100px] rounded-full" />
        {/* Subtle dot matrix grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        {/* ============================================================== */}
        {/* 1. TOP NAVIGATION GRID (4 Clean Columns + Callout Card)        */}
        {/* ============================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-10 pb-16 border-b border-white/10">
          {/* Column 1: The Expedition (Col 1-2) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-400">
              THE EXPEDITION
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans">
              <li>
                <a href="#about" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  The Shoreline
                </a>
              </li>
              <li>
                <a href="#spirit" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  8-Hour Format
                </a>
              </li>
              <li>
                <a href="#twist" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  Zero-Hour Twist
                </a>
              </li>
              <li>
                <a href="#faq" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  Survival FAQ
                </a>
              </li>
              <li>
                <a href="/admin" className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-mono text-xs transition-colors duration-200">
                  Organizer Admin ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: The Fleet (Col 3-4) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-400">
              THE FLEET
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans">
              <li>
                <button
                  onClick={onRegisterClick}
                  className="text-left text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  Squad Finder ↗
                </button>
              </li>
              <li>
                <a href="#experience" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  Tactile Soundboard
                </a>
              </li>
              <li>
                <a href="#interactive-timer" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  Sprint Simulator
                </a>
              </li>
              <li>
                <a href="#faq" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  Gear & Venue
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Buildicy Collective (Col 5-6) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-400">
              BUILDICY
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans">
              <li>
                <a href="#about" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  About Buildicy
                </a>
              </li>
              <li>
                <span className="text-zinc-500 text-xs">First Edition · 2026</span>
              </li>
              <li>
                <a href="#top" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  Curious Minds
                </a>
              </li>
              <li>
                <a
                  href="https://lovable.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  Lovable Platform ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources (Col 7-8) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-400">
              RESOURCES
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans">
              <li>
                <span className="text-zinc-400 hover:text-white cursor-pointer transition-colors duration-200" onClick={onRegisterClick}>
                  Registration Desk
                </span>
              </li>
              <li>
                <a href="#faq" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  Offline Protocol
                </a>
              </li>
              <li>
                <span className="text-zinc-400">Bangalore, IN</span>
              </li>
              <li>
                <a href="#top" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  Radar Beacon
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Right Callout Card (Like 27x.ai's "Still deciding? Let AI make the case") */}
          <div className="col-span-2 md:col-span-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all duration-300">
            <div>
              <div className="flex items-center gap-2 text-purple-400 font-mono text-[11px] font-bold tracking-widest uppercase mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> STILL CURIOUS?
              </div>
              <h5 className="text-base sm:text-lg font-display font-semibold text-white tracking-tight leading-snug">
                Step into the dark. Build with your team.
              </h5>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Eight hours of uninterrupted focus and an unannounced zero-hour surprise.
              </p>
            </div>

            {/* 4 Interactive Builder Badges */}
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {badges.map((b) => {
                  const Icon = b.icon;
                  const isSelected = activeBadge === b.name;
                  return (
                    <button
                      key={b.name}
                      onClick={() => handleBadgeClick(b.name, b.pitch)}
                      className={`group/badge flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-[10px] font-mono transition-all duration-200 ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-400 scale-105 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                          : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
                      }`}
                      title={`Build with ${b.name}`}
                    >
                      <Icon className="w-4 h-4 mb-1 text-purple-400 group-hover/badge:scale-110 transition-transform" />
                      <span>{b.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Primary Callout Action Button */}
              <button
                onClick={onRegisterClick}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 hover:shadow-purple-700/50 transition-all duration-200 hover:scale-[1.02]"
              >
                <span>JOIN THE BLACKOUT</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. THE MONUMENTAL CENTERPIECE (Giant Typographic Brandmark)   */}
        {/* ============================================================== */}
        <div
          ref={brandRef}
          onMouseMove={handleMouseMove}
          className="relative w-full pt-12 pb-8 flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Mouse Interactive Spotlight Beam behind the giant typography */}
          <div
            className="absolute w-[450px] h-[250px] rounded-full pointer-events-none transition-transform duration-150 ease-out blur-[90px] opacity-60"
            style={{
              left: `${mousePos.x}%`,
              top: `${mousePos.y}%`,
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(99, 102, 241, 0.2) 60%, transparent 100%)',
            }}
          />

          {/* Giant Monumental 27X.ai-Style Typography */}
          <div className="relative z-10 flex items-baseline justify-center tracking-tighter leading-none">
            {/* "build" in Frosted Metallic Silver-White Gradient */}
            <span
              className="text-[16vw] sm:text-[14vw] lg:text-[13rem] font-display font-black tracking-tighter uppercase bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent drop-shadow-[0_10px_35px_rgba(255,255,255,0.12)] transition-all duration-300 hover:brightness-110"
              style={{ letterSpacing: '-0.05em' }}
            >
              build
            </span>

            {/* "icy" in Radiant Electric Neon Purple Gradient */}
            <span
              className="text-[16vw] sm:text-[14vw] lg:text-[13rem] font-display font-black tracking-tighter uppercase bg-gradient-to-b from-purple-300 via-violet-500 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-[0_15px_45px_rgba(168,85,247,0.45)] transition-all duration-300 hover:brightness-125"
              style={{ letterSpacing: '-0.05em' }}
            >
              icy
            </span>

            {/* Radiant glowing beacon dot at the end */}
            <span className="w-[2vw] h-[2vw] sm:w-[1.6vw] sm:h-[1.6vw] lg:w-6 lg:h-6 rounded-full bg-gradient-to-tr from-purple-500 to-fuchsia-300 ml-1 sm:ml-2 mb-[1.5vw] shadow-[0_0_25px_rgba(216,180,254,0.9)] animate-pulse" />
          </div>

          <div className="text-[10px] sm:text-xs font-mono tracking-[0.35em] text-zinc-500 uppercase -mt-2 sm:-mt-4">
            EIGHT HOURS · ZERO-HOUR SURPRISE · BANGALORE
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. BOTTOM BAR (Copyright, Social Circle Pills, Location)      */}
        {/* ============================================================== */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-zinc-400">
          {/* Left: Copyright */}
          <div className="flex items-center gap-2">
            <span>© 2026 buildicy</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-500">First Edition Blackout Hackathon</span>
          </div>

          {/* Center: Social Links in Floating Circular Pills */}
          <div className="flex items-center gap-2.5">
            {[
              { label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
              { label: 'X (Twitter)', icon: Twitter, href: 'https://twitter.com' },
              { label: 'Discord', icon: MessageSquare, href: 'https://discord.com' },
              { label: 'GitHub', icon: Github, href: 'https://github.com' },
            ].map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-purple-600/30 border border-white/10 hover:border-purple-400/60 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm"
                  aria-label={social.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              );
            })}
          </div>

          {/* Right: Location & Smooth Back to Top */}
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-zinc-400 text-xs">
              <MapPin className="w-3.5 h-3.5 text-purple-400" /> Bangalore, IN
            </span>

            {/* Back to top smooth launcher button */}
            <button
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-xs font-mono transition-all duration-200"
              title="Return to the top of the adventure"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
