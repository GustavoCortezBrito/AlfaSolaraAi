'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Budget } from '@/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ViewBudgetModal from './ViewBudgetModal';

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
    await supabase.auth.signOut();
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
      rascunho: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
      enviado: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      aprovado: 'bg-green-500/20 text-green-300 border-green-500/50',
      rejeitado: 'bg-red-500/20 text-red-300 border-red-500/50',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                ALFA SOLAR
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Dashboard de Orçamentos</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {profile?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition font-semibold text-xs sm:text-sm cursor-pointer"
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
                className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition cursor-pointer"
                title="Meu Perfil"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-xs sm:text-sm cursor-pointer"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total de Orçamentos</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{totalBudgets}</p>
              </div>
              <div className="text-3xl sm:text-4xl">📋</div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Valor Total</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
                  R$ {(totalValue / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="text-3xl sm:text-4xl">💰</div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Taxa de Conversão</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{conversionRate}%</p>
              </div>
              <div className="text-3xl sm:text-4xl">📈</div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Aprovados</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{approvedBudgets}</p>
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
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700 mb-6"
        >
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <input
                type="text"
                placeholder="Buscar por cliente ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 sm:py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-2 sm:py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm sm:text-base"
              >
                <option value="todos">Todos</option>
                <option value="rascunho">Rascunho</option>
                <option value="enviado">Enviado</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
              </select>
              <Link
                href="/calculadora"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition whitespace-nowrap text-center cursor-pointer text-sm sm:text-base"
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
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 sm:p-12 border border-slate-700 text-center"
            >
              <div className="text-5xl sm:text-6xl mb-4">📋</div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Nenhum orçamento encontrado</h3>
              <p className="text-gray-400 mb-6 text-sm sm:text-base">
                {searchTerm || statusFilter !== 'todos' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando seu primeiro orçamento'}
              </p>
              <Link
                href="/calculadora"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition cursor-pointer text-sm sm:text-base"
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
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700 hover:border-blue-500/50 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">{budget.client_name}</h3>
                      {getStatusBadge(budget.status)}
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Localização</p>
                        <p className="text-white font-medium text-sm sm:text-base">{budget.cidade}, {budget.estado}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Potência</p>
                        <p className="text-white font-medium text-sm sm:text-base">
                          {budget.calculation_result.potencia_kwp.toFixed(2)} kWp
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Investimento</p>
                        <p className="text-white font-medium text-sm sm:text-base">
                          R$ {budget.calculation_result.custo_estimado.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Data</p>
                        <p className="text-white font-medium text-sm sm:text-base">
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
                      className="flex-1 lg:flex-none px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition text-xs sm:text-sm cursor-pointer"
                    >
                      Ver
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownloadPDF(budget)}
                      className="flex-1 lg:flex-none px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-xs sm:text-sm cursor-pointer"
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
