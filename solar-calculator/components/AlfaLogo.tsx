'use client';

import { motion } from 'framer-motion';
import { useId } from 'react';

interface AlfaLogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'solar' | 'esquadrias';
}

export default function AlfaLogo({ 
  className = "w-16 h-16", 
  showText = false,
  variant = 'solar'
}: AlfaLogoProps) {
  // useId garante IDs únicos e consistentes entre server e client
  const uniqueId = useId();
  const metalId = `metal-${uniqueId}`;
  const solarId = `solar-${uniqueId}`;
  const sunId = `sun-${uniqueId}`;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="flex items-center gap-3"
    >
      {/* Logo SVG - Versão Solar */}
      <svg 
        viewBox="0 0 120 120" 
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradiente metálico prateado */}
          <linearGradient id={metalId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#e5e7eb', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#d1d5db', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#9ca3af', stopOpacity: 1 }} />
          </linearGradient>
          
          {/* Gradiente azul/cyan para solar */}
          <linearGradient id={solarId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          </linearGradient>
          
          {/* Gradiente sol */}
          <radialGradient id={sunId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 0.8 }} />
          </radialGradient>
        </defs>
        
        {variant === 'solar' && (
          <>
            {/* Sol estilizado (fundo) */}
            <circle cx="60" cy="35" r="18" fill={`url(#${sunId})`} opacity="0.3"/>
            
            {/* Raios do sol */}
            <g stroke={`url(#${sunId})`} strokeWidth="2" strokeLinecap="round" opacity="0.4">
              <line x1="60" y1="12" x2="60" y2="8"/>
              <line x1="73" y1="22" x2="77" y2="18"/>
              <line x1="78" y1="35" x2="82" y2="35"/>
              <line x1="73" y1="48" x2="77" y2="52"/>
              <line x1="47" y1="22" x2="43" y2="18"/>
              <line x1="42" y1="35" x2="38" y2="35"/>
            </g>
          </>
        )}
        
        {/* Logo Alfa - Duplo A */}
        <g>
          {/* Primeiro A */}
          <path 
            d="M 25 95 L 50 30 L 60 30 L 85 95 L 75 95 L 70 80 L 40 80 L 35 95 Z M 43 70 L 67 70 L 55 45 Z" 
            fill={`url(#${metalId})`}
            stroke="#9ca3af"
            strokeWidth="1"
          />
          
          {/* Segundo A (efeito duplo) */}
          <path 
            d="M 30 95 L 55 30 L 65 30 L 90 95 L 80 95 L 75 80 L 45 80 L 40 95 Z M 48 70 L 72 70 L 60 45 Z" 
            fill={`url(#${metalId})`}
            stroke="#60a5fa"
            strokeWidth="1"
            opacity="0.8"
          />
        </g>
        
        {variant === 'solar' && (
          <>
            {/* Painel solar estilizado */}
            <g opacity="0.6">
              {/* Linhas do painel */}
              <line x1="40" y1="55" x2="75" y2="55" stroke={`url(#${solarId})`} strokeWidth="1.5"/>
              <line x1="42" y1="62" x2="73" y2="62" stroke={`url(#${solarId})`} strokeWidth="1.5"/>
              <line x1="44" y1="69" x2="71" y2="69" stroke={`url(#${solarId})`} strokeWidth="1.5"/>
              
              {/* Células solares */}
              <g fill={`url(#${solarId})`} opacity="0.4">
                <rect x="45" y="52" width="4" height="4" rx="0.5"/>
                <rect x="52" y="52" width="4" height="4" rx="0.5"/>
                <rect x="59" y="52" width="4" height="4" rx="0.5"/>
                <rect x="66" y="52" width="4" height="4" rx="0.5"/>
              </g>
            </g>
            
            {/* Ícone de raio/energia */}
            <path 
              d="M 95 25 L 90 33 L 93 33 L 91 39 L 96 31 L 93 31 Z" 
              fill={`url(#${solarId})`}
              opacity="0.6"
            />
          </>
        )}
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-white font-bold text-xl tracking-wider">ALFA</span>
          <span className={`text-xs tracking-widest font-semibold ${
            variant === 'solar' ? 'text-cyan-400' : 'text-gray-400'
          }`}>
            {variant === 'solar' ? 'SOLAR' : 'ESQUADRIAS'}
          </span>
        </div>
      )}
    </motion.div>
  );
}
