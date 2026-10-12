import React from 'react';
import './isometric-cube-loader.css';

interface IsometricCubeLoaderProps {
  className?: string;
  scale?: number;
  label?: string;
}

export function IsometricCubeLoader({
  className = '',
  scale = 0.72,
  label = 'BUILD ENGINE · ACTIVE SPRINT RUNTIME',
}: IsometricCubeLoaderProps) {
  return (
    <div
      className={`isometric-cube-stage flex flex-col items-center justify-center p-4 select-none ${className}`}
      aria-label="3D Isometric rolling cubes build engine"
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: '200px',
          height: '240px',
        }}
        className="flex items-center justify-center"
      >
        <div className="loader">
          <div className="box box0">
            <div />
          </div>
          <div className="box box1">
            <div />
          </div>
          <div className="box box2">
            <div />
          </div>
          <div className="box box3">
            <div />
          </div>
          <div className="box box4">
            <div />
          </div>
          <div className="box box5">
            <div />
          </div>
          <div className="box box6">
            <div />
          </div>
          <div className="box box7">
            <div />
          </div>
          <div className="ground">
            <div />
          </div>
        </div>
      </div>

      {label && (
        <div className="mt-3 text-[11px] font-mono tracking-widest text-primary/80 uppercase font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          {label}
        </div>
      )}
    </div>
  );
}
