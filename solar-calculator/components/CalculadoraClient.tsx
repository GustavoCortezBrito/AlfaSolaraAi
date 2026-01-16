'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import SolarForm from '@/components/SolarForm';
import AlfaLogo from '@/components/AlfaLogo';
import Link from 'next/link';

interface CalculadoraClientProps {
  user: any;
  profile: any;
}

export default function CalculadoraClient({ user, profile }: CalculadoraClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            href="/dashboard"
            className="px-4 sm:px-6 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 text-white rounded-lg transition backdrop-blur-sm text-sm sm:text-base"
          >
            ← Dashboard
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition font-semibold text-xs sm:text-sm"
              >
                👑 Admin
              </Link>
            )}
            <div className="text-right hidden sm:block">
              <p className="text-white font-medium text-sm">{profile?.name || user.email}</p>
              <p className="text-gray-400 text-xs capitalize">{profile?.role || 'vendedor'}</p>
            </div>
            <Link
              href="/perfil"
              className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
              title="Meu Perfil"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-xs sm:text-sm"
            >
              Sair
            </button>
          </div>
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
