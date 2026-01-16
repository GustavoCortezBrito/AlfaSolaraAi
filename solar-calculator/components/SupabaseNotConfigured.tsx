'use client';

import Link from 'next/link';

export default function SupabaseNotConfigured() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700">
          {/* Ícone */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⚙️</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Supabase Não Configurado
            </h1>
            <p className="text-gray-400">
              Configure o Supabase para usar autenticação e banco de dados
            </p>
          </div>

          {/* Instruções */}
          <div className="bg-slate-900/50 rounded-lg p-6 mb-6 space-y-4">
            <h2 className="text-xl font-semibold text-blue-400 mb-3">
              📋 Como Configurar (15 minutos)
            </h2>
            
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <div>
                  <p className="font-medium">Criar conta no Supabase</p>
                  <p className="text-sm text-gray-400">
                    Acesse{' '}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      supabase.com
                    </a>
                    {' '}e crie uma conta gratuita
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <div>
                  <p className="font-medium">Criar novo projeto</p>
                  <p className="text-sm text-gray-400">
                    Nome: alfa-solar, Região: South America (São Paulo)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div>
                  <p className="font-medium">Copiar credenciais</p>
                  <p className="text-sm text-gray-400">
                    Settings → API → Copie Project URL e anon key
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <div>
                  <p className="font-medium">Atualizar .env.local</p>
                  <p className="text-sm text-gray-400">
                    Cole as credenciais no arquivo .env.local
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </span>
                <div>
                  <p className="font-medium">Executar SQL</p>
                  <p className="text-sm text-gray-400">
                    SQL Editor → Executar supabase/schema.sql
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documentação */}
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 mb-6">
            <p className="text-blue-200 text-sm">
              📖 <strong>Guia completo:</strong> Veja o arquivo{' '}
              <code className="bg-slate-900/50 px-2 py-1 rounded text-blue-300">
                INICIO_RAPIDO_SUPABASE.md
              </code>
              {' '}para instruções detalhadas passo a passo.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition text-center"
            >
              Ir para Supabase →
            </a>
          </div>

          {/* Nota */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              💡 Configure o Supabase para usar o sistema completo com autenticação e banco de dados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
