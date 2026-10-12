import React from 'react';
import './blackout-neon-title.css';

interface BlackoutNeonTitleProps {
  className?: string;
  caption?: string;
}

const BLACKOUT_LETTERS = [
  { char: 'B', x: '-9rem', y: '-7rem', r: '-45deg', d: '0.1s' },
  { char: 'L', x: '-6rem', y: '8rem', r: '30deg', d: '0.3s' },
  { char: 'A', x: '-3rem', y: '-9rem', r: '-20deg', d: '0.2s' },
  { char: 'C', x: '0rem', y: '7rem', r: '45deg', d: '0.5s' },
  { char: 'K', x: '3rem', y: '-6rem', r: '-30deg', d: '0.3s' },
  { char: 'O', x: '6rem', y: '9rem', r: '40deg', d: '0.6s' },
  { char: 'U', x: '8rem', y: '-7rem', r: '-45deg', d: '0.4s' },
  { char: 'T', x: '10rem', y: '5rem', r: '25deg', d: '0.7s' },
];

const HACKATHON_LETTERS = [
  { char: 'H', x: '-8rem', y: '5rem', r: '25deg', d: '0.7s' },
  { char: 'A', x: '-6rem', y: '-5rem', r: '-30deg', d: '1.0s' },
  { char: 'C', x: '-4rem', y: '6rem', r: '40deg', d: '0.8s' },
  { char: 'K', x: '-2rem', y: '-6rem', r: '-20deg', d: '1.2s' },
  { char: 'A', x: '0rem', y: '5rem', r: '30deg', d: '0.9s' },
  { char: 'T', x: '2rem', y: '-5rem', r: '-35deg', d: '1.3s' },
  { char: 'H', x: '4rem', y: '6rem', r: '25deg', d: '1.1s' },
  { char: 'O', x: '6rem', y: '-6rem', r: '-25deg', d: '1.4s' },
  { char: 'N', x: '8rem', y: '5rem', r: '35deg', d: '1.2s' },
];

export function BlackoutNeonTitle({
  className = '',
  caption = 'BUILT FOR CURIOUS MINDS · 8 HOURS OF CREATION',
}: BlackoutNeonTitleProps) {
  return (
    <div
      className={`uiverse-title-pattern ${className}`}
      role="heading"
      aria-level={1}
      aria-label="Blackout Hackathon"
    >
      <div className="bg-glow" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />
      <div className="dust-layer" aria-hidden="true" />

      {/* Floating Retro Doodles / Sparks */}
      <div className="doodle-layer" aria-hidden="true">
        <div className="doodle spark d1" style={{ top: '15%', left: '18%' }} />
        <div className="doodle scratch d2" style={{ top: '78%', left: '82%' }} />
        <div className="doodle dot d3" style={{ top: '22%', left: '76%' }} />
        <div className="doodle spark d4" style={{ top: '82%', left: '22%' }} />
        <div className="doodle scratch d5" style={{ top: '48%', left: '8%' }} />
        <div className="doodle dot d6" style={{ top: '52%', left: '92%' }} />
      </div>

      <div className="title-stage">
        {/* Top Glowing Neon Line */}
        <div className="neon-line top-line" aria-hidden="true">
          <div className="neon-line-inner" />
        </div>

        {/* Main Title: BLACKOUT */}
        <div className="main-title font-display">
          {BLACKOUT_LETTERS.map((item, idx) => (
            <span
              key={idx}
              className="letter"
              data-char={item.char}
              style={
                {
                  '--x': item.x,
                  '--y': item.y,
                  '--r': item.r,
                  '--d': item.d,
                } as React.CSSProperties
              }
            >
              {item.char}
            </span>
          ))}
        </div>

        {/* Sub Title: HACKATHON */}
        <div className="sub-title font-display">
          {HACKATHON_LETTERS.map((item, idx) => (
            <span
              key={idx}
              className="letter"
              data-char={item.char}
              style={
                {
                  '--x': item.x,
                  '--y': item.y,
                  '--r': item.r,
                  '--d': item.d,
                } as React.CSSProperties
              }
            >
              {item.char}
            </span>
          ))}
        </div>

        {/* Bottom Glowing Neon Line */}
        <div className="neon-line bottom-line" aria-hidden="true">
          <div className="neon-line-inner" />
        </div>

        {/* Retro Sub-Caption */}
        <div className="caption">{caption}</div>
      </div>
    </div>
  );
}
