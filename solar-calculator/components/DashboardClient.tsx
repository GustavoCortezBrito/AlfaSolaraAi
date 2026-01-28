'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Budget } from '@/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ViewBudgetModal from './ViewBudgetModal';
import AlfaLogo from './AlfaLogo';

interface DashboardClientProps {
  user: any;
  profile: any;
  initialBudgets: Budget[];
}

export default function DashboardClient({ user, profile, initialBudgets }: DashboardClientProps) {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    // Verificar se é usuário de desenvolvimento
    const devUser = localStorage.getItem('alfa_solar_dev_user');
    
    if (devUser) {
      // Logout do usuário de desenvolvimento
      localStorage.removeItem('alfa_solar_dev_user');
      document.cookie = 'alfa_solar_dev_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } else {
      // Logout do Supabase
      await supabase.auth.signOut();
    }
    
    router.push('/login');
    router.refresh();
  };

  const handleViewBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setShowViewModal(true);
  };

  const handleChangeStatus = async (budgetId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar status');

      // Atualizar lista local
      setBudgets(budgets.map(b => 
        b.id === budgetId ? { ...b, status: newStatus as any } : b
      ));

      // Atualizar orçamento selecionado se for o mesmo
      if (selectedBudget?.id === budgetId) {
        setSelectedBudget({ ...selectedBudget, status: newStatus as any });
      }

      alert(`Orçamento marcado como ${newStatus}!`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status. Tente novamente.');
    }
  };

  const handleDownloadPDF = async (budget: Budget) => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cep: budget.cep,
          cidade: budget.cidade,
          estado: budget.estado,
          consumoMedioMensal: budget.consumo_medio_mensal,
          pretendAumentar: budget.pretend_aumentar,
          equipamentosAdicionais: budget.equipamentos_adicionais || [],
          calculation: budget.calculation_result,
          dataGeracao: new Date(budget.created_at).toLocaleDateString('pt-BR'),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Orcamento-${budget.client_name.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  // Filtrar orçamentos
  const filteredBudgets = budgets.filter((budget) => {
    const matchesSearch = budget.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.cidade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || budget.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calcular métricas
  const totalBudgets = budgets.length;
  const totalValue = budgets.reduce((sum, b) => sum + (b.calculation_result.custo_estimado || 0), 0);
  const approvedBudgets = budgets.filter(b => b.status === 'aprovado').length;
  const conversionRate = totalBudgets > 0 ? (approvedBudgets / totalBudgets * 100).toFixed(1) : '0';

  const getStatusBadge = (status: string) => {
    const styles = {
      rascunho: 'bg-slate-100 text-slate-700 border-slate-300',
      enviado: 'bg-blue-50 text-blue-700 border-blue-200',
      aprovado: 'bg-green-50 text-green-700 border-green-200',
      rejeitado: 'bg-red-50 text-red-700 border-red-200',
    };

    const labels = {
      rascunho: '📝 Rascunho',
      enviado: '📧 Enviado',
      aprovado: '✅ Aprovado',
      rejeitado: '❌ Rejeitado',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-24 left-24 w-36 h-36 border border-amber-400/20 rotate-45"></div>
        <div className="absolute top-56 right-32 w-28 h-28 border border-yellow-400/20 -rotate-12"></div>
        <div className="absolute bottom-48 left-16 w-32 h-32 border border-amber-400/20 rotate-12"></div>
        <div className="absolute bottom-24 right-40 w-40 h-40 border border-yellow-400/20 -rotate-45"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <AlfaLogo className="w-12 h-12" variant="solar" theme="light" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-alfa-gradient">
                  ALFA SOLAR
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">Dashboard de Orçamentos</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {profile?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition font-semibold text-xs sm:text-sm cursor-pointer shadow-lg"
                >
                  👑 Admin
                </Link>
              )}
              <div className="text-right hidden sm:block">
                <p className="text-slate-900 font-medium text-sm">{profile?.name || user.email}</p>
                <p className="text-slate-600 text-xs capitalize">{profile?.role || 'vendedor'}</p>
              </div>
              <Link
                href="/perfil"
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                title="Meu Perfil"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition text-xs sm:text-sm cursor-pointer"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Métricas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm">Total de Orçamentos</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{totalBudgets}</p>
              </div>
              <div className="text-3xl sm:text-4xl">📋</div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm">Valor Total</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                  R$ {(totalValue / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="text-3xl sm:text-4xl">💰</div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm">Taxa de Conversão</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{conversionRate}%</p>
              </div>
              <div className="text-3xl sm:text-4xl">📈</div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm">Aprovados</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{approvedBudgets}</p>
              </div>
              <div className="text-3xl sm:text-4xl">✅</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Ações e Filtros */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-lg mb-6"
        >
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <input
                type="text"
                placeholder="Buscar por cliente ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-2 sm:py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-sm sm:text-base"
              >
                <option value="todos">Todos</option>
                <option value="rascunho">Rascunho</option>
                <option value="enviado">Enviado</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
              </select>
              <Link
                href="/calculadora"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition whitespace-nowrap text-center cursor-pointer text-sm sm:text-base shadow-lg"
              >
                + Novo Orçamento
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Lista de Orçamentos */}
        <div className="space-y-4">
          {filteredBudgets.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-lg text-center"
            >
              <div className="text-5xl sm:text-6xl mb-4">📋</div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Nenhum orçamento encontrado</h3>
              <p className="text-slate-600 mb-6 text-sm sm:text-base">
                {searchTerm || statusFilter !== 'todos' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando seu primeiro orçamento'}
              </p>
              <Link
                href="/calculadora"
                className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition cursor-pointer text-sm sm:text-base shadow-lg"
              >
                Criar Primeiro Orçamento
              </Link>
            </motion.div>
          ) : (
            filteredBudgets.map((budget, index) => (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 hover:border-amber-300 hover:shadow-lg transition shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{budget.client_name}</h3>
                      {getStatusBadge(budget.status)}
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
                      <div>
                        <p className="text-slate-600 text-xs sm:text-sm">Localização</p>
                        <p className="text-slate-900 font-medium text-sm sm:text-base">{budget.cidade}, {budget.estado}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs sm:text-sm">Potência</p>
                        <p className="text-slate-900 font-medium text-sm sm:text-base">
                          {budget.calculation_result.potencia_kwp.toFixed(2)} kWp
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs sm:text-sm">Investimento</p>
                        <p className="text-slate-900 font-medium text-sm sm:text-base">
                          R$ {budget.calculation_result.custo_estimado.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs sm:text-sm">Data</p>
                        <p className="text-slate-900 font-medium text-sm sm:text-base">
                          {new Date(budget.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 lg:ml-4">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewBudget(budget)}
                      className="flex-1 lg:flex-none px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition text-xs sm:text-sm cursor-pointer border border-amber-200"
                    >
                      Ver
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownloadPDF(budget)}
                      className="flex-1 lg:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition text-xs sm:text-sm cursor-pointer border border-slate-200"
                    >
                      PDF
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Modal de Visualização */}
      <ViewBudgetModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedBudget(null);
        }}
        budget={selectedBudget}
        onStatusChange={handleChangeStatus}
      />
    </div>
  );
}
