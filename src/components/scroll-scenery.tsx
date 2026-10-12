import { useEffect, useRef } from 'react';
import { Send, Sparkles, Orbit, Compass } from 'lucide-react';

export function AmbientScrollScenery() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) return;
        const scrollY = window.scrollY;

        // Subtly translate floating elements at different parallax rates
        const plane = el.querySelector<HTMLElement>('.parallax-plane');
        const star1 = el.querySelector<HTMLElement>('.parallax-star-1');
        const star2 = el.querySelector<HTMLElement>('.parallax-star-2');
        const compass = el.querySelector<HTMLElement>('.parallax-compass');

        if (plane) {
          const planeOffset = (scrollY * 0.12) % 360;
          plane.style.transform = `translateY(${planeOffset}px) rotate(${15 + Math.sin(scrollY * 0.005) * 8}deg)`;
        }
        if (star1) {
          star1.style.transform = `translateY(${-(scrollY * 0.08) % 250}px) rotate(${scrollY * 0.1}deg)`;
        }
        if (star2) {
          star2.style.transform = `translateY(${-(scrollY * 0.15) % 300}px) rotate(${-scrollY * 0.12}deg)`;
        }
        if (compass) {
          compass.style.transform = `rotate(${scrollY * 0.06}deg)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Paper airplane drifting on right side */}
      <div className="parallax-plane absolute right-[4%] top-[45%] opacity-25 text-primary transition-transform duration-75 will-change-transform hidden md:block">
        <Send className="w-10 h-10 rotate-45" />
      </div>

      {/* Parallax Star 1 on left side */}
      <div className="parallax-star-1 absolute left-[3%] top-[35%] opacity-20 text-primary transition-transform duration-75 will-change-transform hidden md:block">
        <Sparkles className="w-8 h-8" />
      </div>

      {/* Parallax Star 2 on right side */}
      <div className="parallax-star-2 absolute right-[6%] top-[70%] opacity-20 text-lime transition-transform duration-75 will-change-transform hidden md:block">
        <Sparkles className="w-6 h-6" />
      </div>

      {/* Compass rose on left side */}
      <div className="parallax-compass absolute left-[2%] top-[80%] opacity-15 text-night transition-transform duration-75 will-change-transform hidden lg:block">
        <Compass className="w-12 h-12" />
      </div>
    </div>
  );
}
