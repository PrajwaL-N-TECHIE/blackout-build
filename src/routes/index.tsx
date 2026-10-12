import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState, MouseEvent } from 'react';
import { ArrowDown, ArrowUpRight, Sparkles, Rocket, Plus, Menu, X, Zap, MoveUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import landscape from '@/assets/blackout-landscape.jpg';
import buildicyLogo from '@/assets/buildicy-logo.png';
import { eventFormat } from '@/lib/event-format';
import { SceneToys, BlackoutJourney, FishFollower } from '@/components/event-playground';
import { BuildicyBeacon } from '@/components/buildicy-beacon';
import { InteractiveTimer } from '@/components/interactive-timer';
import { MarqueeTicker } from '@/components/marquee-ticker';
import { RadarSignalScanner } from '@/components/radar-scanner';
import { FloatingStickers } from '@/components/floating-stickers';
import { BuilderExperience } from '@/components/builder-experience';
import { FaqAccordion } from '@/components/faq-accordion';
import { AmbientScrollScenery } from '@/components/scroll-scenery';
import { SkyCloudsAndStars } from '@/components/sky-clouds-stars';
import { TurntablePlayer } from '@/components/turntable-player';
import { Link } from '@tanstack/react-router';
import { SeaBeachTransition } from '@/components/sea-beach-transition';
import { SeaRiseTransition } from '@/components/sea-rise-transition';
import { MonumentalFooter } from '@/components/monumental-footer';
import { BlackoutNeonTitle } from '@/components/blackout-neon-title';
import { RegistrationSection } from '@/components/registration-section';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Blackout Hackathon — Buildicy' },
      {
        name: 'description',
        content:
          'An eight-hour hackathon conducted by Buildicy. Bold ideas, curious minds, and a surprise revealed at the start of hackathon day.',
      },
      { property: 'og:title', content: 'Blackout Hackathon by Buildicy' },
      { property: 'og:description', content: 'Eight hours. One surprise. You, your team, and a bold idea.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Index,
});

const links = [
  { label: 'About', href: '#about' },
  { label: 'The blackout', href: '#format' },
  { label: 'The experience', href: '#experience' },
  { label: 'Register', href: '#register' },
  { label: 'FAQ', href: '#faq' },
];

function Brand() {
  return (
    <a href="#top" className="brand group relative flex items-center gap-2.5" aria-label="Buildicy home">
      <div className="relative flex items-center justify-center">
        <img
          src={buildicyLogo}
          alt="Buildicy Logo"
          width={32}
          height={36}
          className="object-contain drop-shadow transition-transform duration-300 group-hover:scale-110"
        />
        <div className="brand-beacon-indicator" />
      </div>
      <span className="font-display font-bold tracking-tight text-foreground text-xl">
        buildicy<span className="text-primary font-normal"> / </span>
      </span>
    </a>
  );
}

function Index() {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sceneRef = useRef<HTMLImageElement>(null);
  const statCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (sceneRef.current && !reduced) {
          const progress = Math.min(window.scrollY / 830, 1);
          sceneRef.current.style.transform = `translateY(${progress * 200}px) scale(${1.02 + progress * 0.12})`;
          sceneRef.current.closest<HTMLElement>('.hero')?.style.setProperty('--hero-scroll', `${progress}`);
        }
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      cancelAnimationFrame(frame);
    };
  }, []);

  const handleStatCardMouseMove = (e: MouseEvent<HTMLDivElement>, idx: number) => {
    const card = statCardRefs.current[idx];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const register = () => {
    const el = document.getElementById('register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setRegistrationOpen(true);
    }
  };

  return (
    <>
      <FishFollower />
      <AmbientScrollScenery />

      {/* Header */}
      <header className="site-header">
        <div className="nav-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <Button variant="outline" size="sm" onClick={register} className="shadow-sm hover:border-primary">
              Join the blackout <ArrowUpRight className="ml-1 w-3.5 h-3.5" />
            </Button>
          </nav>
          <Button
            className="mobile-nav"
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && (
          <nav className="mobile-links" aria-label="Mobile navigation">
            {links.map((link) => (
              <a href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <Button
              onClick={() => {
                setMenuOpen(false);
                register();
              }}
            >
              Join the blackout <ArrowUpRight className="ml-1 w-3.5 h-3.5" />
            </Button>
          </nav>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero" id="top" aria-label="Blackout Hackathon">
          <img
            ref={sceneRef}
            className="hero-scene"
            src={landscape}
            alt="A paper adventure map with a laptop, radio, cassette, and rocket in a moonlit mountain landscape"
            width={1536}
            height={1024}
            fetchPriority="high"
          />
          <div className="hero-cloud cloud-left" aria-hidden="true" />
          <div className="hero-cloud cloud-right" aria-hidden="true" />
          <SkyCloudsAndStars />
          <SceneToys />

          <div className="hero-copy">
            {/* Sleek compact Buildicy Beacon */}
            <div className="mb-2 flex justify-center">
              <BuildicyBeacon size="sm" interactive={true} />
            </div>

            <div className="edition">BUILDICY PRESENTS · FIRST EDITION</div>
            
            {/* Retro Stranger Things / Neon Scatter Title Header */}
            <BlackoutNeonTitle className="my-1 sm:my-2" />

            <p className="hero-tagline">Build. Wonder. Break through.</p>
            <div className="flex justify-center">
              <p className="hero-detail">
                8 hours of creation <span>✦</span> One unexpected adventure
              </p>
            </div>

            <div className="flex justify-center">
              <Button variant="hero" className="hero-cta" onClick={register}>
                Join the blackout <ArrowUpRight />
              </Button>
            </div>
            <div className="flex justify-center">
              <p className="cta-note">Some surprises are worth showing up for.</p>
            </div>
          </div>

          <div className="hero-side">CURIOUS MINDS. UNEXPECTED POSSIBILITIES.</div>

          {links.map((link) => (
            <a className="scene-link" key={link.href} href={link.href} aria-label={link.label}>
              <span>{link.label} ↗</span>
            </a>
          ))}

          <a href="#about" className="hero-scroll" aria-label="Explore the hackathon">
            <span>THE ADVENTURE AWAITS</span>
            <ArrowDown size={21} />
          </a>
        </section>

        {/* Infinite Marquee Ticker */}
        <MarqueeTicker />

        {/* Floating Physical Stickers */}
        <div className="max-w-6xl mx-auto px-4 -mt-3 mb-2">
          <FloatingStickers />
        </div>

        {/* Creative Interactive Countdown & 8-Hour Sprint Simulator */}
        <div className="max-w-6xl mx-auto px-4 mb-4">
          <InteractiveTimer onRegisterClick={register} />
        </div>

        {/* About Section */}
        <section id="about">
          <div className="section-inner">
            <div className="about-grid reveal">
              <div>
                <div className="eyebrow">
                  <Sparkles /> NOT YOUR USUAL HACKATHON
                </div>
                <h2 className="section-title">
                  A spark of curiosity.
                  <br />
                  A leap into
                  <br />
                  <em>the unexpected.</em>
                </h2>
              </div>
              <div>
                <p className="body-copy">
                  Welcome to <strong>Blackout Hackathon.</strong> Eight hours to bring curious minds together
                  and build something that’s truly yours.
                </p>
                <p className="body-copy">
                  There’s a twist in this adventure. We’re keeping it a secret until the day begins. Bring
                  your team, your curiosity, and a willingness to surprise yourself.
                </p>
                <div className="about-note">
                  <Zap size={17} /> A first-of-its-kind challenge. A whole new way to build.
                </div>
              </div>
            </div>

            {/* Spotlight Interactive Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-8 border-t border-border">
              {[
                { number: `${eventFormat.totalHours} hours`, label: 'One unforgettable challenge', note: 'THE SPRINT' },
                { number: '1 surprise', label: 'Revealed on hackathon day', note: 'THE TWIST' },
                { number: '∞ ideas', label: 'No limit to your imagination', note: 'THE POSSIBILITIES' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    statCardRefs.current[idx] = el;
                  }}
                  onMouseMove={(e) => handleStatCardMouseMove(e, idx)}
                  className="spotlight-card group relative p-6 rounded-2xl border border-border/80 bg-card/60 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 text-center overflow-hidden"
                >
                  <div className="spotlight-radial absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold block mb-1">
                    {stat.note}
                  </span>
                  <strong className="font-display text-4xl sm:text-5xl font-semibold block text-foreground group-hover:scale-105 transition-transform">
                    {stat.number}
                  </strong>
                  <span className="text-xs text-muted-foreground mt-2 block font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Interactive Radar Frequency Scanner Easter Egg */}
            <div className="mt-16 reveal">
              <div className="text-center mb-6">
                <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                  ✦ INTERACTIVE GADGET · TUNE IN ✦
                </span>
                <h3 className="text-2xl font-display font-semibold mt-1">
                  Discover the <em>Buildicy Signal</em>
                </h3>
              </div>
              <RadarSignalScanner />
            </div>
          </div>
        </section>

        {/* The Blackout Journey Section */}
        <BlackoutJourney />

        {/* Hack The North Rotating Vinyl Turntable Player */}
        <div className="max-w-5xl mx-auto px-4 -mt-10 mb-10 relative z-20 reveal">
          <TurntablePlayer />
        </div>

        {/* Hack The North Scroll-Driven Rising Sea Tide: Waves surge upwards from down to up! */}
        <SeaRiseTransition />

        {/* The Experience Section - Enhanced with Interactive Sticker Canvas & Builder Pillars */}
        <section id="experience" className="spirit py-10 md:py-16 relative overflow-hidden">
          <BuilderExperience onRegisterClick={register} />
        </section>

        {/* Official Blackout Hackathon Registration Station */}
        <RegistrationSection />

        {/* FAQ Section - Enhanced with Balanced 2-Column Grid & Top Command Bar */}
        <section id="faq" className="py-14 md:py-20 relative bg-background/50">
          <FaqAccordion onRegisterClick={register} />
        </section>

        {/* Closing Section with Featured Buildicy Beacon */}
        <section className="closing relative py-20 md:py-28 bg-gradient-to-b from-background via-background to-[#03060f] overflow-hidden">
          <div className="reveal max-w-2xl mx-auto flex flex-col items-center">
            {/* Large interactive Buildicy Beacon */}
            <div className="mb-6">
              <BuildicyBeacon size="lg" interactive={true} />
            </div>

            <div className="edition">YOUR NEXT BIG IDEA STARTS HERE</div>
            <h2 className="mt-5 text-4xl sm:text-5xl font-display font-semibold">
              Step into the unknown.
              <br />
              Come back with something great.
            </h2>
            <p className="mt-4 text-muted-foreground">Eight hours. Your team. A world of possibilities.</p>
            <Button variant="hero" className="hero-cta mt-6" onClick={register}>
              Join the blackout <ArrowUpRight />
            </Button>
            <div className="cta-note mt-3">An adventure conducted by Buildicy.</div>
          </div>
        </section>
      </main>

      {/* Monumental Dark Futuristic Footer (Inspired by 27x.ai) */}
      <MonumentalFooter onRegisterClick={register} />

      {/* Registration Dialog */}
      <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md">
          <div className="eyebrow">
            <Sparkles /> THE FIRST EDITION
          </div>
          <DialogTitle className="text-3xl font-display">Registrations are open!</DialogTitle>
          <DialogDescription className="leading-7">
            Secure your station in the Blackout Hackathon. Submit your builder profile or crew to receive an official boarding pass.
          </DialogDescription>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="hero"
              className="flex-1"
              onClick={() => {
                setRegistrationOpen(false);
                document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Fill Registration Form <ArrowDown className="ml-1 w-4 h-4" />
            </Button>
            <Link to="/admin">
              <Button variant="outline" className="w-full sm:w-auto">
                Admin Console
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
