import React from 'react';

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