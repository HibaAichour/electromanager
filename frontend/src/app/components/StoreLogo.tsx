import React from 'react';

export function StoreLogo() {
  return (
    <div className="logo-container">
      <svg
        className="logo-3d w-12 h-12 mx-auto mb-2"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>f
        
        {/* Building Base */}
        <rect
          x="20"
          y="40"
          width="60"
          height="45"
          fill="url(#logoGradient)"
          rx="2"
          filter="url(#glow)"
        />
        
        {/* Building Top/Roof */}
        <path
          d="M 15 40 L 50 20 L 85 40"
          fill="url(#logoGradient)"
          filter="url(#glow)"
        />
        
        {/* Windows */}
        <rect x="28" y="48" width="8" height="8" fill="rgba(255,255,255,0.6)" rx="1" />
        <rect x="42" y="48" width="8" height="8" fill="rgba(255,255,255,0.6)" rx="1" />
        <rect x="56" y="48" width="8" height="8" fill="rgba(255,255,255,0.6)" rx="1" />
        <rect x="70" y="48" width="8" height="8" fill="rgba(255,255,255,0.6)" rx="1" />
        
        <rect x="28" y="60" width="8" height="8" fill="rgba(255,255,255,0.6)" rx="1" />
        <rect x="42" y="60" width="8" height="8" fill="rgba(255,255,255,0.6)" rx="1" />
        <rect x="56" y="60" width="8" height="8" fill="rgba(255,255,255,0.6)" rx="1" />
        <rect x="70" y="60" width="8" height="8" fill="rgba(255,255,255,0.6)" rx="1" />
        
        {/* Door */}
        <rect x="44" y="70" width="12" height="15" fill="rgba(255,255,255,0.8)" rx="1" />
        
        {/* Shine Effect */}
        <ellipse
          cx="35"
          cy="35"
          rx="15"
          ry="8"
          fill="url(#shineGradient)"
          opacity="0.6"
          transform="rotate(-20 35 35)"
        />
      </svg>
      
      <h1 className="font-bold text-xl text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
        ElectroManager
      </h1>
      <p className="text-sm text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
        Gestion Multi-Stores
      </p>
    </div>
  );
}
