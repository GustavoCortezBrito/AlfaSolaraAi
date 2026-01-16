'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { FormData, CalculationResult } from '@/types';

interface SaveBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  calculation: CalculationResult;
  onSuccess?: () => void;
}

export default function SaveBudgetModal({
  isOpen,
  onClose,
  formData,
  calculation,
  onSuccess,
}: SaveBudgetModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verificar se Supabase está configurado
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        setError('Configure o Supabase para salvar orçamentos. Veja o arquivo INICIO_RAPIDO_SUPABASE.md');
        setLoading(false);
        return;
      }

      // Verificar se usuário está logado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('Você precisa estar logado para salvar orçamentos. Faça login em /login');
        setLoading(false);
        return;
      }

      // Salvar orçamento
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          client_email: clientEmail || null,
          client_phone: clientPhone || null,
          cep: formData.cep,
          cidade: formData.cidade,
          estado: formData.estado,
          consumo_medio_mensal: formData.consumoMedioMensal,
          pretend_aumentar: formData.pretendAumentar,
          equipamentos_adicionais: formData.equipamentosAdicionais || [],
          calculation_result: calculation,
          status: 'rascunho',
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao salvar orçamento');
      }

      // Sucesso
      if (onSuccess) onSuccess();
      onClose();
      
      // Resetar form
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setNotes('');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar orçamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white">Salvar Orçamento</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Preencha os dados do cliente para salvar este orçamento
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-300 mb-2">
                    Nome do Cliente *
                  </label>
                  <input
                    id="clientName"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="João Silva"
                  />
                </div>

                <div>
                  <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-300 mb-2">
                    Email do Cliente
                  </label>
                  <input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="joao@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-300 mb-2">
                    Telefone do Cliente
                  </label>
                  <input
                    id="clientPhone"
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="(18) 99999-9999"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                    Observações
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    placeholder="Notas adicionais sobre este orçamento..."
                  />
                </div>

                {/* Resumo */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Resumo do Sistema</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Localização:</span>
                      <span className="text-white">{formData.cidade}, {formData.estado}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Potência:</span>
                      <span className="text-white">{calculation.potencia_kwp.toFixed(2)} kWp</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Investimento:</span>
                      <span className="text-white">R$ {calculation.custo_estimado.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !clientName}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Salvando...' : 'Salvar Orçamento'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
