import { useState } from 'react';
import { Rocket, ShieldCheck, Zap, Sparkles, Lock } from 'lucide-react';
import { playStickerPop } from '@/lib/chime';

interface StickerItem {
  id: string;
  icon: typeof Rocket;
  title: string;
  subtitle: string;
  bg: string;
  textColor: string;
  initialRotation: number;
}

export function FloatingStickers() {
  const [wobbleId, setWobbleId] = useState<string | null>(null);

  const stickers: StickerItem[] = [
    {
      id: 'hours',
      icon: Zap,
      title: '8 HOURS',
      subtitle: 'OF CREATION',
      bg: '#10b981', // Emerald
      textColor: '#ffffff',
      initialRotation: -5,
    },
    {
      id: 'secret',
      icon: Lock,
      title: '1 SURPRISE',
      subtitle: 'SEALED TILL DAY 1',
      bg: '#8b5cf6', // Violet
      textColor: '#ffffff',
      initialRotation: 6,
    },
    {
      id: 'spoilers',
      icon: ShieldCheck,
      title: 'NO SPOILERS',
      subtitle: 'WORTH SHOWING UP FOR',
      bg: '#f59e0b', // Amber
      textColor: '#ffffff',
      initialRotation: -4,
    },
    {
      id: 'curiosity',
      icon: Sparkles,
      title: 'WHAT IF?',
      subtitle: 'LET CURIOSITY LEAD',
      bg: '#ec4899', // Pink
      textColor: '#ffffff',
      initialRotation: 5,
    },
  ];

  const handleStickerClick = (id: string, pitch: number) => {
    playStickerPop(pitch);
    setWobbleId(id);
    setTimeout(() => setWobbleId(null), 600);
  };

  return (
    <div className="floating-stickers-container relative w-full pointer-events-auto flex flex-wrap items-center justify-center gap-3 sm:gap-5 my-4 py-2 select-none">
      {stickers.map((stk, idx) => {
        const Icon = stk.icon;
        const isWobbling = wobbleId === stk.id;
        return (
          <div
            key={stk.id}
            onClick={() => handleStickerClick(stk.id, 500 + idx * 80)}
            style={{
              backgroundColor: stk.bg,
              color: stk.textColor,
              transform: `rotate(${stk.initialRotation}deg)`,
            }}
            className={`cursor-pointer px-4 py-2 rounded-2xl border-3 border-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-0 flex items-center gap-2.5 ${
              isWobbling ? 'scale-120 rotate-12' : ''
            }`}
          >
            <div className="p-1 rounded-lg bg-white/20">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-xs font-display font-black tracking-wide">
                {stk.title}
              </div>
              <div className="text-[9px] font-mono tracking-wider font-semibold opacity-90">
                {stk.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
