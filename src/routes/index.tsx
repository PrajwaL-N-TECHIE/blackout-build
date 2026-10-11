import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Sparkles, Rocket, Plus, Menu, X, Zap, MoveUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import landscape from '@/assets/blackout-landscape.jpg';
import logo from '@/assets/buildicy-logo.png.asset.json';
import { eventFormat } from '@/lib/event-format';
import { FishFollower, SceneToys, BlackoutJourney } from '@/components/event-playground';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Blackout Hackathon — Build. Wonder. Break through.' },
    { name: 'description', content: 'An eight-hour hackathon by Buildicy. Bold ideas, curious minds, and a surprise revealed at the start of hackathon day.' },
    { property: 'og:title', content: 'Blackout Hackathon by Buildicy' },
    { property: 'og:description', content: 'Eight hours. One surprise. You, your team, and a bold idea.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

const links = [{ label: 'About', href: '#about' }, { label: 'The blackout', href: '#format' }, { label: 'The experience', href: '#experience' }, { label: 'FAQ', href: '#faq' }];
const faqs = [
  ['What is Blackout Hackathon?', 'An eight-hour hackathon conducted by Buildicy. It’s a space for bold ideas, teamwork, and an unexpected challenge.'],
  ['What’s the surprise?', 'That stays under wraps. We’ll reveal the twist at the start of hackathon day. No spoilers.'],
  ['How long is the hackathon?', 'Eight hours to turn your idea into something real with your team. The full format will be revealed when the event begins.'],
  ['What should I bring?', 'Bring your laptop, charger, and your curiosity. Final event requirements will be shared when registration opens.'],
  ['When and where is the hackathon?', 'The date and venue will be announced by Buildicy. Check back for confirmed event details and registration.'],
  ['How can I register?', 'Registration is not open yet. Buildicy will announce the application details, eligibility, and team requirements before registration begins.'],
];

function Brand() {
  return <a href="#top" className="brand" aria-label="Buildicy home"><img src={logo.url} alt="" width={31} height={34} /><span>buildicy<span> / </span></span></a>;
}

function Index() {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sceneRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (sceneRef.current && !reduced) {
          const progress = Math.min(window.scrollY / 830,1);
          sceneRef.current.style.transform = `translateY(${progress * 200}px) scale(${1.02 + progress * .12})`;
          sceneRef.current.closest('.hero')?.style.setProperty('--hero-scroll', `${progress}`);
        }
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener('scroll', update); cancelAnimationFrame(frame); };
  }, []);
  const register = () => setRegistrationOpen(true);
  return <>
    <FishFollower />
    <header className="site-header">
      <div className="nav-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}
          <Button variant="outline" size="sm" onClick={register}>Join the blackout <ArrowUpRight /></Button>
        </nav>
        <Button className="mobile-nav" variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
      {menuOpen && <nav className="mobile-links" aria-label="Mobile navigation">{links.map(link => <a href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}<Button onClick={() => { setMenuOpen(false); register(); }}>Join the blackout <ArrowUpRight /></Button></nav>}
    </header>
    <main>
      <section className="hero" id="top" aria-label="Blackout Hackathon">
        <img ref={sceneRef} className="hero-scene" src={landscape} alt="A paper adventure map with a laptop, radio, cassette, and rocket in a moonlit mountain landscape" width={1536} height={1024} fetchPriority="high" />
        <div className="hero-cloud cloud-left" aria-hidden="true" /><div className="hero-cloud cloud-right" aria-hidden="true" />
        <SceneToys />
        <div className="hero-copy">
          <div className="edition">BUILDICY PRESENTS · FIRST EDITION</div>
          <h1>Blackout<span>Hackathon</span></h1>
          <p className="hero-tagline">Build. Wonder. Break through.</p>
          <p className="hero-detail">8 hours of creation <span>✦</span> One unexpected adventure</p>
          <Button variant="hero" className="hero-cta" onClick={register}>Join the blackout <ArrowUpRight /></Button>
          <p className="cta-note">Some surprises are worth showing up for.</p>
        </div>
        <div className="hero-side">CURIOUS MINDS. UNEXPECTED POSSIBILITIES.</div>
        {links.map(link => <a className="scene-link" key={link.href} href={link.href} aria-label={link.label}><span>{link.label} ↗</span></a>)}
        <a href="#about" className="hero-scroll" aria-label="Explore the hackathon"><span>THE ADVENTURE AWAITS</span><ArrowDown size={21} /></a>
      </section>
      <section id="about">
        <div className="section-inner">
          <div className="about-grid reveal">
            <div><div className="eyebrow"><Sparkles /> NOT YOUR USUAL HACKATHON</div><h2 className="section-title">A spark of curiosity.<br />A leap into<br /><em>the unexpected.</em></h2></div>
            <div><p className="body-copy">Welcome to <strong>Blackout Hackathon.</strong> Eight hours to bring curious minds together and build something that’s truly yours.</p><p className="body-copy">There’s a twist in this adventure. We’re keeping it a secret until the day begins. Bring your team, your curiosity, and a willingness to surprise yourself.</p><div className="about-note"><Zap size={17} /> A first-of-its-kind challenge. A whole new way to build.</div></div>
          </div>
          <div className="stats reveal"><div className="stat"><strong>{eventFormat.totalHours} hours</strong><span>One unforgettable challenge</span></div><div className="stat"><strong>1 surprise</strong><span>Revealed on hackathon day</span></div><div className="stat"><strong>∞ ideas</strong><span>No limit to your imagination</span></div></div>
        </div>
      </section>
      <BlackoutJourney />
      <section id="experience" className="spirit"><div className="section-inner spirit-grid">
        <div className="offline-art reveal" aria-hidden="true"><Sparkles className="art-spark one" /><div className="offline-sticker"><Rocket /><strong>WHAT IF?</strong><span>LET CURIOSITY LEAD.</span></div><Sparkles className="art-spark two" /></div>
        <div className="reveal"><div className="eyebrow"><Sparkles /> BUILT FOR THE BUILDERS</div><h2 className="section-title">Your best resource?<br /><em>Each other.</em></h2><p className="body-copy">Every great idea starts somewhere. Swap ideas, tackle the unexpected, and discover what happens when your team takes a leap together.</p><p className="body-copy">More experimenting. More creating. Something you can proudly say: <strong>we built that.</strong></p><Button variant="link" onClick={register} className="px-0">Find your next adventure <MoveUpRight /></Button></div>
      </div></section>
      <section id="faq"><div className="section-inner faq-grid">
        <div className="reveal"><div className="eyebrow"><Plus /> A FEW THINGS TO KNOW</div><h2 className="section-title">Curious?<br /><em>Good. So are we.</em></h2><p className="body-copy">Your questions, before the lights go out.</p></div>
        <div className="faq-list reveal">{faqs.map(([question, answer]) => <details key={question} className="faq-item"><summary>{question}<Plus /></summary><p>{answer}</p></details>)}</div>
      </div></section>
      <section className="closing"><div className="reveal"><div className="edition">YOUR NEXT BIG IDEA STARTS HERE</div><h2 className="mt-5">Step into the unknown.<br />Come back with something great.</h2><p>Eight hours. Your team. A world of possibilities.</p><Button variant="hero" className="hero-cta" onClick={register}>Join the blackout <ArrowUpRight /></Button><div className="cta-note">An adventure by Buildicy.</div></div></section>
    </main>
    <footer className="footer"><div className="footer-inner"><Brand /><small>Made for curious minds. Conducted by Buildicy.</small></div></footer>
    <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}><DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md"><div className="eyebrow"><Sparkles /> THE FIRST EDITION</div><DialogTitle className="text-3xl font-display">Your adventure is coming.</DialogTitle><DialogDescription className="leading-7">Registration for Blackout Hackathon hasn’t opened yet. Buildicy will announce the date, venue, and application details soon.</DialogDescription><Button variant="hero" onClick={() => setRegistrationOpen(false)}>Can’t wait <ArrowUpRight /></Button></DialogContent></Dialog>
  </>;
}
