import { useEffect, useState } from 'react';
import { ParallaxStarfield } from '@/components/parallax-starfield';

export function SkyCloudsAndStars() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-2" aria-hidden="true">
      {/* 3-Tier Multi-Depth Parallax Starfield Backdrop */}
      <ParallaxStarfield className="opacity-45" />

      {/* Hack The North Style Swirling Storybook Cloud 1 (High Altitude, Far Left) */}
      <div className="puffy-cloud cloud-speed-1 top-[4%] -left-[280px] opacity-85">
        <svg viewBox="0 0 240 80" width="240" height="80" className="filter drop-shadow-sm">
          {/* Swirling organic storybook cloud with curled spiral flourish */}
          <path
            d="M30 65 C15 65 0 54 0 40 C0 26 14 16 28 18 C34 6 52 -2 72 2 C88 6 100 16 106 28 C116 18 136 16 150 26 C162 18 182 18 194 28 C206 20 226 22 234 34 C244 40 244 54 234 62 C224 66 210 65 198 65 Z"
            fill="#ffffff"
            fillOpacity="0.88"
          />
          {/* Inner decorative storybook spiral line */}
          <path
            d="M60 38 C70 30 84 32 88 42 C92 52 82 58 74 54 C68 50 72 44 76 45"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Hack The North Style Swirling Storybook Cloud 2 (High Altitude, Far Right) */}
      <div className="puffy-cloud cloud-speed-2 top-[7%] -left-[320px] opacity-80">
        <svg viewBox="0 0 260 85" width="260" height="85" className="filter drop-shadow-sm">
          <path
            d="M35 70 C18 70 0 58 0 44 C0 28 16 18 32 20 C40 8 60 0 80 4 C98 8 110 20 118 32 C130 20 152 18 168 28 C180 20 202 20 216 30 C228 22 248 24 256 36 C266 44 266 58 256 66 C244 70 230 70 218 70 Z"
            fill="#ffffff"
            fillOpacity="0.82"
          />
          {/* Storybook swirl flourish */}
          <path
            d="M140 44 C150 36 164 38 168 48 C172 58 162 64 154 60 C148 56 152 50 156 51"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      </div>

      {/* Hack The North Style Swirling Storybook Cloud 3 (Top Center Drifting) */}
      <div className="puffy-cloud cloud-speed-3 top-[3%] -left-[260px] opacity-75">
        <svg viewBox="0 0 220 75" width="220" height="75" className="filter drop-shadow-sm">
          <path
            d="M25 60 C12 60 0 50 0 38 C0 24 14 16 28 18 C36 6 52 -1 70 3 C86 7 96 17 102 28 C112 18 132 16 144 26 C156 18 174 18 186 28 C196 22 212 24 218 34 C226 42 226 52 218 58 C208 60 196 60 186 60 Z"
            fill="#ffffff"
            fillOpacity="0.8"
          />
        </svg>
      </div>

      {/* Shining 4-Pointed Golden & Cyan Sparkle Stars (✦) framing mountain crests */}
      <div className="shining-star star-pos-1">
        <svg viewBox="0 0 32 32" width="32" height="32">
          <defs>
            <radialGradient id="goldShine" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="16" cy="16" r="15" fill="url(#goldShine)" />
          <path
            d="M16 0 L18.5 12 L31 16 L18.5 20 L16 32 L13.5 20 L1 16 L13.5 12 Z"
            fill="#fef08a"
            stroke="#ca8a04"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      <div className="shining-star star-pos-2">
        <svg viewBox="0 0 26 26" width="26" height="26">
          <defs>
            <radialGradient id="cyanShine" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="13" cy="13" r="12" fill="url(#cyanShine)" />
          <path
            d="M13 0 L15 10 L25 13 L15 16 L13 26 L11 16 L1 13 L11 10 Z"
            fill="#e0f2fe"
            stroke="#0284c7"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      <div className="shining-star star-pos-3">
        <svg viewBox="0 0 28 28" width="28" height="28">
          <circle cx="14" cy="14" r="13" fill="url(#goldShine)" />
          <path
            d="M14 0 L16 10.5 L27 14 L16 17.5 L14 28 L12 17.5 L1 14 L12 10.5 Z"
            fill="#fef08a"
            stroke="#ca8a04"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      <div className="shining-star star-pos-4">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <circle cx="12" cy="12" r="11" fill="url(#cyanShine)" />
          <path
            d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"
            fill="#ffffff"
            stroke="#a855f7"
            strokeWidth="0.8"
          />
        </svg>
      </div>
    </div>
  );
}
