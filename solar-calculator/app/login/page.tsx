'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SupabaseNotConfigured from '@/components/SupabaseNotConfigured';
import AlfaLogo from '@/components/AlfaLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se Supabase está configurado
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes('placeholder')) {
      setSupabaseConfigured(false);
    }
  }, []);

  if (!supabaseConfigured) {
    return <SupabaseNotConfigured />;
  }

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sistema de bypass para desenvolvimento
      if (email === 'admin@admin.com' && password === 'senha123') {
        // Simular login de admin para desenvolvimento
        const devUser = {
          id: 'dev-admin-id',
          email: 'admin@admin.com',
          role: 'admin',
          name: 'Admin Desenvolvimento'
        };
        
        // Salvar no localStorage e cookie
        localStorage.setItem('alfa_solar_dev_user', JSON.stringify(devUser));
        document.cookie = `alfa_solar_dev_user=${JSON.stringify(devUser)}; path=/; max-age=86400`; // 24 horas
        
        router.push('/dashboard');
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-24 left-24 w-36 h-36 border border-amber-400/20 rotate-45"></div>
        <div className="absolute top-56 right-32 w-28 h-28 border border-yellow-400/20 -rotate-12"></div>
        <div className="absolute bottom-48 left-16 w-32 h-32 border border-amber-400/20 rotate-12"></div>
        <div className="absolute bottom-24 right-40 w-40 h-40 border border-yellow-400/20 -rotate-45"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="flex justify-center mb-4">
            <AlfaLogo className="w-16 h-16" variant="solar" theme="light" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-alfa-gradient">
            ALFA SOLAR
          </h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">Sistema de Orçamentos Inteligente</p>
        </motion.div>

        {/* Card de Login */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Entrar no Sistema</h2>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs sm:text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm sm:text-base"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm sm:text-base"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(245, 158, 11, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-2 sm:py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar no Sistema'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-xs sm:text-sm">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-amber-600 hover:text-amber-700 font-medium cursor-pointer transition-colors">
                Registrar-se
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-slate-500 text-xs">
            © 2026 Alfa Solar - Energia Solar Fotovoltaica
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
