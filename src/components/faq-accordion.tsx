import { useState, useRef, useEffect, MouseEvent } from 'react';
import {
  Plus,
  Sparkles,
  HelpCircle,
  LockKeyhole,
  Clock,
  Backpack,
  MapPin,
  Ticket,
  Radio,
  Lightbulb,
  Check,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playAccordionClick, playTerminalChirp, playStickerPop } from '@/lib/chime';

interface FaqAccordionProps {
  onRegisterClick?: () => void;
}

interface FaqItemData {
  id: string;
  category: 'all' | 'twist' | 'format' | 'prep' | 'reg';
  categoryLabel: string;
  categoryColor: string;
  icon: typeof HelpCircle;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItemData[] = [
  {
    id: 'what-is',
    category: 'format',
    categoryLabel: 'THE BASICS',
    categoryColor: 'oklch(0.55 0.22 298)',
    icon: HelpCircle,
    question: 'What is Blackout Hackathon?',
    answer:
      'An eight-hour hackathon conducted by Buildicy. It’s a dedicated space for bold ideas, tight-knit teamwork, and an unexpected challenge that tests your creativity.',
  },
  {
    id: 'surprise',
    category: 'twist',
    categoryLabel: 'THE TWIST · SECRET',
    categoryColor: 'oklch(0.65 0.24 330)',
    icon: LockKeyhole,
    question: 'What’s the surprise?',
    answer:
      'That stays strictly under wraps. We’ll reveal the twist at the start of hackathon day. No spoilers, no early leaks—just pure spontaneity and fast adaptation.',
  },
  {
    id: 'duration',
    category: 'format',
    categoryLabel: '8-HOUR SPRINT',
    categoryColor: 'oklch(0.7 0.18 140)',
    icon: Clock,
    question: 'How long is the hackathon?',
    answer:
      'Eight continuous hours to turn your idea into a working build alongside your team. The full schedule and milestone format will be unveiled when the event begins.',
  },
  {
    id: 'bring',
    category: 'prep',
    categoryLabel: 'PACKING LIST',
    categoryColor: 'oklch(0.75 0.16 80)',
    icon: Backpack,
    question: 'What should I bring?',
    answer:
      'Bring your laptop, charger, student/personal ID, and your curiosity. Final event checklist and hardware recommendations will be shared when registration opens.',
  },
  {
    id: 'venue',
    category: 'prep',
    categoryLabel: 'LOCATION & DATE',
    categoryColor: 'oklch(0.6 0.16 230)',
    icon: MapPin,
    question: 'When and where is the hackathon?',
    answer:
      'The date and venue will be announced officially by Buildicy. Check back on this portal for confirmed venue logistics and schedule drops.',
  },
  {
    id: 'register',
    category: 'reg',
    categoryLabel: 'APPLICATIONS',
    categoryColor: 'oklch(0.65 0.22 298)',
    icon: Ticket,
    question: 'How can I register?',
    answer:
      'Registration is not open yet. Buildicy will announce the application portal, team sizes, and eligibility criteria soon. Join the notification list above!',
  },
];

const HACKER_TIPS = [
  'Tip 01: In an 8-hour sprint, pick a focused scope and polish it until it gleams.',
  'Tip 02: The mystery twist is your catalyst—build around it, not in spite of it.',
  'Tip 03: Ship early. A working demo with 2 clean features beats an incomplete app with 10.',
  'Tip 04: Complement each other. Great teams balance frontend craft with architecture.',
  'Tip 05: Rest your eyes for 5 minutes at the halfway mark. Fresh perspective spots sneaky bugs.',
  'Tip 06: Save 45 minutes for your pitch and live demo. How you tell the story matters!',
];

const PACKING_ITEMS = [
  { id: 'laptop', label: 'Laptop & High-Watt Charger', mandatory: true },
  { id: 'id', label: 'Student / Government Photo ID', mandatory: true },
  { id: 'curiosity', label: 'Curiosity & Fast Adaptation', mandatory: true },
  { id: 'headphones', label: 'Noise-Cancelling Headphones', mandatory: false },
  { id: 'snacks', label: 'Team Energy Snacks & Bottle', mandatory: false },
];

const SPRINT_PHASES = [
  { time: '00:00', title: 'The Kickoff', desc: 'Doors open & secret twist unveiled.' },
  { time: '02:00', title: 'Architecture', desc: 'Wireframes locked, repos initialized.' },
  { time: '05:30', title: 'Deep Build', desc: 'Feature complete & bug squashing.' },
  { time: '08:00', title: 'Showcase', desc: 'Live pitch, demos & judges review.' },
];

export function FaqAccordion({ onRegisterClick }: FaqAccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(['what-is', 'surprise']);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'twist' | 'format' | 'prep' | 'reg'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tipIndex, setTipIndex] = useState(0);
  const [packedItems, setPackedItems] = useState<string[]>(['laptop', 'id', 'curiosity']);
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [sonarPinged, setSonarPinged] = useState(false);
  const [viewMode, setViewMode] = useState<'dossier' | 'compact'>('dossier');

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const terminalRef = useRef<HTMLDivElement>(null);

  const toggleItem = (id: string) => {
    const isCurrentlyOpen = openIds.includes(id);
    playAccordionClick(!isCurrentlyOpen);

    setOpenIds((prev) =>
      isCurrentlyOpen ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    playAccordionClick(true);
    setOpenIds(FAQ_ITEMS.map((item) => item.id));
  };

  const collapseAll = () => {
    playAccordionClick(false);
    setOpenIds([]);
  };

  const rollTip = () => {
    playTerminalChirp();
    setTipIndex((prev) => (prev + 1) % HACKER_TIPS.length);
  };

  const togglePacked = (id: string) => {
    playStickerPop(packedItems.includes(id) ? 420 : 680);
    setPackedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const triggerSonarPing = () => {
    playStickerPop(750);
    setSonarPinged(true);
    setTimeout(() => setSonarPinged(false), 1600);
  };

  const handleCardMouseMove = (e: MouseEvent<HTMLDivElement>, id: string) => {
    const card = cardRefs.current[id];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  // Filtered FAQs based on category AND text search
  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Staggered Scroll Parallax for FAQ Cards
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const winH = window.innerHeight;

        if (rect.top <= winH && rect.bottom >= 0) {
          const totalDist = winH + rect.height;
          const progress = Math.max(0, Math.min(1, (winH - rect.top) / totalDist));

          Object.entries(cardRefs.current).forEach(([id, el], index) => {
            if (el) {
              const isEven = index % 2 === 0;
              const yOffset = (1 - progress) * (isEven ? 35 : 65);
              const xOffset = (1 - progress) * (isEven ? -10 : 10);
              el.style.transform = `translateY(${yOffset}px) translateX(${xOffset}px)`;
            }
          });

          if (terminalRef.current) {
            const yTerm = (1 - progress) * 25;
            terminalRef.current.style.transform = `translateY(${yTerm}px)`;
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
  }, [filteredFaqs]);

  return (
    <div ref={containerRef} className="section-inner max-w-6xl mx-auto px-4 relative">
      {/* Decorative Parallax Background Stars */}
      <div className="absolute -top-10 left-6 pointer-events-none opacity-20 text-primary hidden md:block">
        <Sparkles className="w-8 h-8 animate-spin-slow" />
      </div>
      <div className="absolute top-1/2 -right-8 pointer-events-none opacity-15 text-lime hidden lg:block">
        <Compass className="w-12 h-12" />
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 reveal">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> THE HACKER FIELD DOSSIER
        </div>
        <h2 className="text-4xl sm:text-5xl font-display font-semibold text-foreground">
          Curious? <em>Good. So are we.</em>
        </h2>
        <p className="body-copy mt-3 text-base text-muted-foreground">
          Everything you need to know before the blackout lights go out. Unfurl the artifacts below.
        </p>
      </div>

      {/* Interactive Command & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3.5 rounded-2xl bg-card/85 border border-border/80 backdrop-blur-md shadow-sm mb-8 reveal">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full pl-9.5 pr-4 py-1.5 rounded-xl text-xs bg-background/80 border border-border/70 focus:border-primary focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {[
            { id: 'all', label: 'All Artifacts' },
            { id: 'twist', label: 'Classified Twist 🔒' },
            { id: 'format', label: '8h Timeline ⏱' },
            { id: 'prep', label: 'Gear & Radar 🎒' },
            { id: 'reg', label: 'Ticket Pass 🎟' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-sm scale-102'
                  : 'bg-background/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View Mode & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/60">
            <button
              onClick={() => setViewMode('dossier')}
              className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-all ${
                viewMode === 'dossier' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
              }`}
            >
              Dossier
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-all ${
                viewMode === 'compact' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
              }`}
            >
              Compact
            </button>
          </div>

          <button
            onClick={expandAll}
            className="text-xs font-mono font-bold text-muted-foreground hover:text-primary transition-colors hidden sm:block"
          >
            Expand All
          </button>
        </div>
      </div>

      {/* Creative 2-Column Grid with Unique Handcrafted Artifact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 reveal">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIds.includes(faq.id);
          const Icon = faq.icon;

          return (
            <div
              key={faq.id}
              ref={(el) => {
                cardRefs.current[faq.id] = el;
              }}
              onMouseMove={(e) => handleCardMouseMove(e, faq.id)}
              className={`spotlight-card group relative rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-start will-change-transform shadow-sm ${
                isOpen
                  ? 'border-primary/50 bg-card/95 shadow-md ring-1 ring-primary/20'
                  : 'border-border/80 bg-card/75 hover:border-primary/30 hover:bg-card hover:shadow-md'
              }`}
            >
              <div className="spotlight-radial absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Card Header Accordion Trigger */}
              <button
                type="button"
                onClick={() => toggleItem(faq.id)}
                className="w-full p-5 flex items-center justify-between text-left gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isOpen
                        ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                        : 'bg-primary/10 text-primary group-hover:bg-primary/15'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-primary block uppercase">
                        {faq.categoryLabel}
                      </span>
                      {faq.id === 'surprise' && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-500 text-[9px] font-mono font-bold uppercase border border-rose-500/20">
                          SEALED
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-semibold text-base sm:text-lg text-foreground">
                      {faq.question}
                    </h3>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen
                      ? 'bg-primary/15 text-primary rotate-45'
                      : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </div>
              </button>

              {/* Card Body with Creative Artifact Widgets */}
              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed animate-fadeIn">
                  <div className="pt-3 border-t border-border/60 space-y-3">
                    <p>{faq.answer}</p>

                    {/* CREATIVE ARTIFACT 1: Official Mission Directive Stamp (for 'what-is') */}
                    {faq.id === 'what-is' && viewMode === 'dossier' && (
                      <div className="mt-3 p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono font-bold text-primary block uppercase">
                            OFFICIAL SPRINT DIRECTIVE
                          </span>
                          <span className="text-xs font-sans text-foreground font-medium">
                            Equal Ground · Zero Pre-work · 8 Pure Hours
                          </span>
                        </div>
                        <div className="rubber-stamp text-primary text-[10px] px-2 py-0.5 rounded border border-primary/50">
                          AUTHENTIC BUILD
                        </div>
                      </div>
                    )}

                    {/* CREATIVE ARTIFACT 2: Classified Redacted File (for 'surprise') */}
                    {faq.id === 'surprise' && viewMode === 'dossier' && (
                      <div className="mt-3 p-3.5 rounded-xl bg-slate-900 text-slate-100 border border-rose-500/30 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                          <span className="text-rose-400 flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5" /> CLASSIFIED // LEVEL 5 SEAL
                          </span>
                          <span className="text-slate-400">HOUR 00:00 DECRYPTION</span>
                        </div>
                        <div className="text-xs font-mono leading-loose bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                          STATUS: The event twist involves{' '}
                          <span className="classified-redacted" title="Hover to inspect">
                            [QUANTUM SPRINT]
                          </span>{' '}
                          revealed via{' '}
                          <span className="classified-redacted" title="Hover to inspect">
                            [SECRET DIRECTIVE]
                          </span>{' '}
                          at the morning kickoff.
                        </div>
                        <span className="text-[10px] text-slate-400 block italic">
                          ✦ Hover over blacked-out bars to test your clearance!
                        </span>
                      </div>
                    )}

                    {/* CREATIVE ARTIFACT 3: Interactive 8-Hour Sprint Milestone Track (for 'duration') */}
                    {faq.id === 'duration' && viewMode === 'dossier' && (
                      <div className="mt-3 p-3.5 rounded-xl bg-muted/50 border border-border space-y-2.5">
                        <span className="text-[10px] font-mono font-bold text-primary uppercase block">
                          ✦ THE 8-HOUR SPRINT RADAR TRACK
                        </span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {SPRINT_PHASES.map((phase, pIdx) => (
                            <button
                              key={phase.time}
                              onClick={() => setSelectedPhase(pIdx)}
                              className={`p-2 rounded-lg text-left transition-all ${
                                selectedPhase === pIdx
                                  ? 'bg-card border border-primary/50 shadow-xs ring-1 ring-primary/20'
                                  : 'bg-background/60 hover:bg-card border border-border/50'
                              }`}
                            >
                              <span className="text-[10px] font-mono font-bold text-primary block">
                                {phase.time}
                              </span>
                              <span className="text-[11px] font-semibold text-foreground block truncate">
                                {phase.title}
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="p-2 rounded-lg bg-card border border-border/60 text-xs">
                          <span className="font-semibold text-foreground">
                            {SPRINT_PHASES[selectedPhase]?.title} ({SPRINT_PHASES[selectedPhase]?.time}):
                          </span>{' '}
                          {SPRINT_PHASES[selectedPhase]?.desc}
                        </div>
                      </div>
                    )}

                    {/* CREATIVE ARTIFACT 4: Interactive Packing Checklist (for 'bring') */}
                    {faq.id === 'bring' && viewMode === 'dossier' && (
                      <div className="mt-3 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                          <span className="text-amber-600 dark:text-amber-400 uppercase">
                            INTERACTIVE PACKING CHECKLIST
                          </span>
                          <span className="text-muted-foreground">
                            {packedItems.length}/{PACKING_ITEMS.length} Packed
                          </span>
                        </div>
                        <div className="space-y-1">
                          {PACKING_ITEMS.map((item) => {
                            const isPacked = packedItems.includes(item.id);
                            return (
                              <div
                                key={item.id}
                                onClick={() => togglePacked(item.id)}
                                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-card cursor-pointer transition-colors text-xs font-medium"
                              >
                                <div
                                  className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                                    isPacked
                                      ? 'bg-emerald-500 border-emerald-500 text-white'
                                      : 'border-border bg-background'
                                  }`}
                                >
                                  {isPacked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className={isPacked ? 'line-through text-muted-foreground' : 'text-foreground'}>
                                  {item.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* CREATIVE ARTIFACT 5: Live Sonar Radar Beacon Scope (for 'venue') */}
                    {faq.id === 'venue' && viewMode === 'dossier' && (
                      <div className="mt-3 p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/25 flex flex-col sm:flex-row items-center gap-3.5">
                        <div className="relative w-14 h-14 rounded-full border border-emerald-500/40 bg-emerald-950 flex items-center justify-center overflow-hidden shrink-0">
                          {/* Rotating radar sweep beam */}
                          <div className="absolute inset-0 animate-radar-sweep origin-center bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(16,185,129,0.5)_360deg)]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 block uppercase">
                            RADAR SCANNER · STATUS: PRE-COORDINATES
                          </span>
                          <span className="text-xs text-foreground font-medium block">
                            Frequency: 88.4 MHz · Coordinates will unlock with registration drop.
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={triggerSonarPing}
                          className="h-7 text-[10px] font-mono font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                        >
                          <Radio className={sonarPinged ? 'w-3 h-3 animate-spin' : 'w-3 h-3'} />
                          {sonarPinged ? 'Ping Sent!' : 'Ping Radar'}
                        </Button>
                      </div>
                    )}

                    {/* CREATIVE ARTIFACT 6: Perforated Boarding Pass Stub (for 'register') */}
                    {faq.id === 'register' && viewMode === 'dossier' && (
                      <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/30 flex items-center justify-between gap-3 relative overflow-hidden">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono font-bold text-primary block uppercase tracking-widest">
                            BOARDING PASS #BLK-2026
                          </span>
                          <span className="text-xs font-semibold text-foreground block">
                            Status: Applications Opening Soon
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground block">
                            ||| |||| || ||||| | |||| |||
                          </span>
                        </div>
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={onRegisterClick}
                          className="h-8 text-xs font-mono font-semibold"
                        >
                          Notify Me <ArrowRight className="ml-1 w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Integrated Interactive "Beacon Dispatch Intel Terminal" */}
      <div
        ref={terminalRef}
        className="p-5 sm:p-6 rounded-3xl border border-primary/25 bg-primary/5 backdrop-blur-md relative overflow-hidden shadow-sm reveal will-change-transform"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-foreground">
              BEACON DISPATCH FREQUENCY · 88.4 MHz · STANDBY
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={rollTip}
            className="h-8 px-3 text-xs font-mono font-bold text-primary hover:bg-primary/10 border-primary/30 gap-1.5 shadow-sm"
          >
            <Radio className="w-3.5 h-3.5 animate-spin-slow" /> Transmit Next Intel Drop
          </Button>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-inner flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1">
              <span>BUILDICY HACKER DIRECTIVE #{tipIndex + 1}</span>
              <span>DROP {tipIndex + 1} OF {HACKER_TIPS.length}</span>
            </div>
            <p className="text-sm font-sans font-medium text-foreground leading-relaxed">
              {HACKER_TIPS[tipIndex]}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>Organizers are preparing the event frequency.</span>
          <span className="cursor-pointer hover:underline text-primary" onClick={rollTip}>
            Roll another tip ↗
          </span>
        </div>
      </div>
    </div>
  );
}
