import React from 'react';

export const KefirGirlLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.1"/>
      </filter>
    </defs>
    
    {/* Outer Badge */}
    <circle cx="100" cy="100" r="95" fill="#ecfdf5" stroke="#15803d" strokeWidth="6" />
    <circle cx="100" cy="100" r="88" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.5" />

    {/* Bubbles / Splash background */}
    <circle cx="40" cy="100" r="5" fill="#bae6fd" opacity="0.6" />
    <circle cx="160" cy="90" r="4" fill="#bae6fd" opacity="0.6" />
    <circle cx="150" cy="110" r="3" fill="#bae6fd" opacity="0.6" />
    <path d="M30,120 Q40,110 35,130" stroke="#bae6fd" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
    <path d="M170,120 Q160,110 165,130" stroke="#bae6fd" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />

    {/* Girl Hair Back */}
    <path d="M60,70 Q50,100 55,130 Q60,140 70,140 L130,140 Q140,140 145,130 Q150,100 140,70" fill="#b45309" />

    {/* Body */}
    <path d="M70,190 Q70,140 100,140 Q130,140 130,190" fill="#7dd3fc" />
    <path d="M85,190 L85,150 L115,150 L115,190" fill="#ffffff" /> {/* Apron */}
    
    {/* Head */}
    <path d="M100,125 L100,135" stroke="#fcd34d" strokeWidth="8" strokeLinecap="round" /> {/* Neck */}
    <ellipse cx="100" cy="95" rx="35" ry="32" fill="#fde68a" /> {/* Face */}

    {/* Facial Features */}
    <circle cx="90" cy="95" r="3.5" fill="#334155" />
    <circle cx="110" cy="95" r="3.5" fill="#334155" />
    <path d="M96,102 Q100,106 104,102" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="82" cy="102" r="4" fill="#fca5a5" opacity="0.4" />
    <circle cx="118" cy="102" r="4" fill="#fca5a5" opacity="0.4" />

    {/* Hair Front */}
    <path d="M65,95 C60,60 140,60 135,95" fill="#b45309" />
    <path d="M65,95 Q70,80 80,90" fill="#b45309" />
    <path d="M135,95 Q130,80 120,90" fill="#b45309" />

    {/* Flower Crown */}
    <g transform="translate(0, -5)">
        <circle cx="75" cy="70" r="5" fill="#60a5fa" stroke="#ffffff" strokeWidth="1" />
        <circle cx="88" cy="65" r="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="100" cy="63" r="5" fill="#60a5fa" stroke="#ffffff" strokeWidth="1" />
        <circle cx="112" cy="65" r="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="125" cy="70" r="5" fill="#60a5fa" stroke="#ffffff" strokeWidth="1" />
    </g>

    {/* Hands holding bottle */}
    <circle cx="85" cy="145" r="8" fill="#fde68a" />
    <circle cx="115" cy="148" r="8" fill="#fde68a" />

    {/* Milk Bottle */}
    <g transform="translate(90, 135) rotate(-10)">
        <rect x="-12" y="-20" width="24" height="40" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="-8" y="-25" width="16" height="5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
        {/* Foam */}
        <circle cx="-5" cy="-28" r="4" fill="#ffffff" />
        <circle cx="2" cy="-30" r="5" fill="#ffffff" />
        <circle cx="8" cy="-26" r="3" fill="#ffffff" />
    </g>

    {/* Ribbon Banner */}
    <path d="M25,150 L175,150 L165,175 L175,200 L25,200 L35,175 L25,150 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
    <path d="M35,160 Q100,185 165,160 L165,190 Q100,215 35,190 Z" fill="#7dd3fc" />

    {/* Text */}
    <text x="100" y="185" textAnchor="middle" fontSize="16" fontWeight="900" fill="white" fontFamily="sans-serif" style={{textShadow: "1px 1px 0px #0284c7"}}>KEFIR GIRL</text>

  </svg>
);

export const MilkKefirMascot: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="90" fill="#f8fafc" />
    {/* Bottle Shape */}
    <path d="M70,160 C70,175 130,175 130,160 L130,100 C130,100 140,90 140,70 L140,50 C140,45 135,40 130,40 L70,40 C65,40 60,45 60,50 L60,70 C60,90 70,100 70,100 L70,160 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="4" />
    {/* Label */}
    <rect x="70" y="100" width="60" height="40" rx="5" fill="#dbeafe" opacity="0.5" />
    {/* Face */}
    <circle cx="85" cy="115" r="4" fill="#334155" />
    <circle cx="115" cy="115" r="4" fill="#334155" />
    <path d="M92,125 Q100,132 108,125" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Blush */}
    <circle cx="78" cy="122" r="3" fill="#fca5a5" opacity="0.6" />
    <circle cx="122" cy="122" r="3" fill="#fca5a5" opacity="0.6" />
  </svg>
);

export const WaterKefirMascot: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="90" fill="#f0f9ff" />
    {/* Jar Shape */}
    <path d="M65,60 L135,60 L140,150 C140,165 60,165 60,150 L65,60 Z" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="3" />
    <rect x="62" y="50" width="76" height="10" rx="2" fill="#cbd5e1" />
    {/* Lemon Slice */}
    <circle cx="120" cy="140" r="15" fill="#fef08a" stroke="#fde047" strokeWidth="2" />
    <path d="M120,140 L120,125" stroke="#fde047" strokeWidth="1" />
    <path d="M120,140 L132,132" stroke="#fde047" strokeWidth="1" />
    <path d="M120,140 L135,140" stroke="#fde047" strokeWidth="1" />
    {/* Bubbles */}
    <circle cx="80" cy="90" r="3" fill="white" opacity="0.6" />
    <circle cx="110" cy="80" r="5" fill="white" opacity="0.6" />
    <circle cx="90" cy="130" r="4" fill="white" opacity="0.6" />
    {/* Face */}
    <circle cx="85" cy="110" r="4" fill="#0f172a" />
    <circle cx="115" cy="110" r="4" fill="#0f172a" />
    <path d="M95,115 Q100,120 105,115" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

export const SleepingMascot: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Blob */}
    <path d="M60,100 Q60,50 100,50 Q140,50 140,100 Q140,150 100,150 Q60,150 60,100 Z" fill="#e2e8f0" />
    {/* Face Sleeping */}
    <path d="M85,105 Q90,100 95,105" stroke="#475569" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M105,105 Q110,100 115,105" stroke="#475569" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="100" cy="120" r="5" fill="#fca5a5" opacity="0.5" />
    {/* Zzz */}
    <text x="150" y="60" fontSize="20" fill="#94a3b8" fontFamily="Quicksand, sans-serif" fontWeight="bold">z</text>
    <text x="160" y="50" fontSize="15" fill="#94a3b8" fontFamily="Quicksand, sans-serif" fontWeight="bold">z</text>
  </svg>
);
