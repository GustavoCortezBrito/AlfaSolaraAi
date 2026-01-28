'use client';

import { motion } from 'framer-motion';
import SolarForm from '@/components/SolarForm';
import AlfaLogo from '@/components/AlfaLogo';

interface CalculadoraClientProps {
  user: any;
  profile: any;
}

export default function CalculadoraClient({ user, profile }: CalculadoraClientProps) {

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      {/* Header Simplificado */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="text-center">
          <h2 className="text-white text-lg font-medium">Alfa Solar - Sistema de Orçamentos</h2>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        {/* Logo da Alfa */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <AlfaLogo className="w-20 h-20" showText={true} />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          <span className="block">Calculadora Solar</span>
          <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Inteligente
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto px-4">
          Dimensione seu sistema fotovoltaico com inteligência artificial
          e receba um orçamento completo em minutos
        </p>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          📍 Presidente Prudente/SP
        </p>
      </motion.div>

      <SolarForm />

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-center mt-12 text-gray-400"
      >
        <p className="text-sm mb-2">
          Powered by Groq AI • Cálculos precisos baseados em dados reais
        </p>
        <p className="text-xs text-slate-500">
          © 2026 Alfa Esquadrias - Todos os direitos reservados
        </p>
      </motion.footer>
    </main>
  );
}
