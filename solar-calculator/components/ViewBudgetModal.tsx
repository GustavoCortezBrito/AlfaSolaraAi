'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Budget } from '@/types';

interface ViewBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: Budget | null;
  onStatusChange?: (budgetId: string, newStatus: string) => void;
}

export default function ViewBudgetModal({ isOpen, onClose, budget, onStatusChange }: ViewBudgetModalProps) {
  if (!budget) return null;

  const potenciaReal = (budget.calculation_result.quantidade_placas * budget.calculation_result.placa_watts) / 1000;
  const producaoMensal = budget.calculation_result.producao_mensal_estimada || 
    Math.round(potenciaReal * budget.calculation_result.irradiacao_media * 30 * 0.80);

  const handleSendWhatsApp = () => {
    const phone = budget.client_phone?.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (!phone) {
      alert('Cliente não possui telefone cadastrado');
      return;
    }

    const message = `Olá ${budget.client_name}! 👋

Segue sua proposta de Sistema Fotovoltaico da Alfa Solar:

☀️ *Potência:* ${potenciaReal.toFixed(2)} kWp
📦 *Módulos:* ${budget.calculation_result.quantidade_placas}x ${budget.calculation_result.placa_watts}W
💰 *Investimento:* R$ ${budget.calculation_result.custo_estimado.toLocaleString('pt-BR')}
⏱️ *Retorno:* ${budget.calculation_result.payback_anos.toFixed(1)} anos
📍 *Local:* ${budget.cidade}, ${budget.estado}

Produção estimada: ${producaoMensal} kWh/mês

Estamos à disposição para esclarecer dúvidas!

_Alfa Solar - Energia Renovável_`;

    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Atualizar status para "enviado"
    if (budget.status === 'rascunho' && onStatusChange) {
      onStatusChange(budget.id, 'enviado');
    }
  };

  const handleSendEmail = () => {
    if (!budget.client_email) {
      alert('Cliente não possui email cadastrado');
      return;
    }

    const subject = `Proposta Sistema Fotovoltaico - Alfa Solar`;
    const body = `Olá ${budget.client_name},

Segue sua proposta personalizada de Sistema Fotovoltaico:

RESUMO DO SISTEMA:
- Potência Instalada: ${potenciaReal.toFixed(2)} kWp
- Módulos Fotovoltaicos: ${budget.calculation_result.quantidade_placas}x ${budget.calculation_result.placa_watts}W
- Inversor: ${budget.calculation_result.inversor}
- Investimento Total: R$ ${budget.calculation_result.custo_estimado.toLocaleString('pt-BR')}
- Retorno do Investimento: ${budget.calculation_result.payback_anos.toFixed(1)} anos

PRODUÇÃO ESTIMADA:
- Produção Mensal: ${producaoMensal} kWh/mês
- Irradiação Solar: ${budget.calculation_result.irradiacao_media.toFixed(2)} kWh/m²/dia

LOCALIZAÇÃO:
${budget.cidade}, ${budget.estado} - CEP: ${budget.cep}

Estamos à disposição para esclarecer qualquer dúvida!

Atenciosamente,
Alfa Solar - Energia Renovável
Presidente Prudente/SP`;

    const mailtoUrl = `mailto:${budget.client_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    
    // Atualizar status para "enviado"
    if (budget.status === 'rascunho' && onStatusChange) {
      onStatusChange(budget.id, 'enviado');
    }
  };

  const handleDownloadPDF = async () => {
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

      if (!response.ok) throw new Error('Erro ao gerar PDF');

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

  const handleChangeStatus = async (newStatus: string) => {
    if (!onStatusChange) return;
    
    try {
      await onStatusChange(budget.id, newStatus);
    } catch (error) {
      console.error('Erro ao mudar status:', error);
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-2xl border-b border-blue-500/50 z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {budget.client_name}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Orçamento #{budget.id.slice(0, 8)}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
                    budget.status === 'rascunho' ? 'bg-gray-500/20 text-gray-300 border-gray-500/50' :
                    budget.status === 'enviado' ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' :
                    budget.status === 'aprovado' ? 'bg-green-500/20 text-green-300 border-green-500/50' :
                    'bg-red-500/20 text-red-300 border-red-500/50'
                  }`}>
                    {budget.status === 'rascunho' ? '📝 Rascunho' :
                     budget.status === 'enviado' ? '📧 Enviado' :
                     budget.status === 'aprovado' ? '✅ Aprovado' :
                     '❌ Rejeitado'}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Criado em {new Date(budget.created_at).toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {/* Cards de Métricas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-blue-300 text-sm mb-1">Potência Instalada</p>
                    <p className="text-2xl font-bold text-white">{potenciaReal.toFixed(2)} kWp</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 rounded-xl p-4">
                    <p className="text-cyan-300 text-sm mb-1">Módulos</p>
                    <p className="text-2xl font-bold text-white">
                      {budget.calculation_result.quantidade_placas}x {budget.calculation_result.placa_watts}W
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-4">
                    <p className="text-green-300 text-sm mb-1">Investimento</p>
                    <p className="text-2xl font-bold text-white">
                      R$ {budget.calculation_result.custo_estimado.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-xl p-4">
                    <p className="text-orange-300 text-sm mb-1">Payback</p>
                    <p className="text-2xl font-bold text-white">
                      {budget.calculation_result.payback_anos.toFixed(1)} anos
                    </p>
                  </div>
                </div>

                {/* Dados do Cliente */}
                <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
                  <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Dados do Cliente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Nome</p>
                      <p className="text-white font-medium">{budget.client_name}</p>
                    </div>
                    {budget.client_email && (
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white font-medium">{budget.client_email}</p>
                      </div>
                    )}
                    {budget.client_phone && (
                      <div>
                        <p className="text-gray-400 text-sm">Telefone</p>
                        <p className="text-white font-medium">{budget.client_phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-400 text-sm">Localização</p>
                      <p className="text-white font-medium">{budget.cidade}, {budget.estado}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">CEP</p>
                      <p className="text-white font-medium">{budget.cep}</p>
                    </div>
                  </div>
                </div>

                {/* Especificações Técnicas */}
                <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    Especificações Técnicas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Consumo Mensal</p>
                      <p className="text-white font-medium">{budget.consumo_medio_mensal} kWh/mês</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Produção Estimada</p>
                      <p className="text-white font-medium">{producaoMensal} kWh/mês</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Irradiação Solar (HSP)</p>
                      <p className="text-white font-medium">
                        {budget.calculation_result.irradiacao_media.toFixed(2)} kWh/m²/dia
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Inversor</p>
                      <p className="text-white font-medium">{budget.calculation_result.inversor}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Potência Mínima Calculada</p>
                      <p className="text-white font-medium">
                        {budget.calculation_result.potencia_kwp.toFixed(2)} kWp
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Eficiência do Sistema</p>
                      <p className="text-white font-medium">80%</p>
                    </div>
                  </div>
                </div>

                {/* Equipamentos Adicionais */}
                {budget.pretend_aumentar && budget.equipamentos_adicionais && budget.equipamentos_adicionais.length > 0 && (
                  <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
                    <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Equipamentos Planejados
                    </h3>
                    <div className="space-y-3">
                      {budget.equipamentos_adicionais.map((eq, index) => {
                        const consumoMensal = (eq.potenciaWatts * eq.horasUsoDia * 30 * eq.quantidade) / 1000;
                        return (
                          <div key={index} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                            <div>
                              <p className="text-white font-medium">{eq.nome}</p>
                              <p className="text-gray-400 text-sm">
                                {eq.quantidade}x {eq.potenciaWatts}W • {eq.horasUsoDia}h/dia
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-purple-300 font-semibold">{consumoMensal.toFixed(0)} kWh/mês</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Análise Técnica */}
                <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
                  <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Análise Técnica
                  </h3>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
                      {budget.calculation_result.explicacao}
                    </p>
                  </div>
                </div>

                {/* Observações */}
                {budget.notes && (
                  <div className="bg-yellow-900/20 rounded-xl p-5 border border-yellow-700/50">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Observações
                    </h3>
                    <p className="text-gray-300 text-sm">{budget.notes}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-slate-800/95 backdrop-blur-sm p-6 border-t border-slate-700 rounded-b-2xl space-y-4">
                {/* Botões de Ação */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={handleSendWhatsApp}
                    disabled={!budget.client_phone}
                    className="px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </button>

                  <button
                    onClick={handleSendEmail}
                    disabled={!budget.client_email}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF
                  </button>

                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition"
                  >
                    Fechar
                  </button>
                </div>

                {/* Botões de Status */}
                {budget.status !== 'aprovado' && budget.status !== 'rejeitado' && (
                  <div className="flex gap-3 pt-3 border-t border-slate-700">
                    <button
                      onClick={() => handleChangeStatus('aprovado')}
                      className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Marcar como Aprovado
                    </button>
                    <button
                      onClick={() => handleChangeStatus('rejeitado')}
                      className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Marcar como Rejeitado
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
