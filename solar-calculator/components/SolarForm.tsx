'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import StepIndicator from './StepIndicator';
import Step1Location from './Step1Location';
import Step2Consumption from './Step2Consumption';
import Step3Expansion from './Step3Expansion';
import Step4Review from './Step4Review';
import SaveBudgetModal from './SaveBudgetModal';
import { FormData, CalculationResult } from '@/types';
import Link from 'next/link';

export default function SolarForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    cep: '',
    cidade: '',
    estado: '',
    consumoMedioMensal: 0,
    pretendAumentar: false,
    equipamentosAdicionais: [],
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.cep && formData.cidade && formData.estado;
      case 2:
        return formData.consumoMedioMensal > 0;
      case 3:
        if (!formData.pretendAumentar) return true;
        if (!formData.equipamentosAdicionais || formData.equipamentosAdicionais.length === 0) return true;
        return formData.equipamentosAdicionais.every(
          eq => eq.nome && eq.potenciaWatts > 0 && eq.quantidade > 0 && eq.horasUsoDia > 0
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Validação extra antes de chamar API
    if (!formData.cidade || !formData.estado || formData.consumoMedioMensal <= 0) {
      setError('Preencha todos os dados antes de gerar o orçamento.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Tratar erros específicos da API
        if (response.status === 429) {
          setError('⚠️ Limite de requisições atingido! A API Groq tem um limite gratuito. Aguarde 1 minuto e tente novamente.');
        } else if (data.errorType === 'invalid_key') {
          setError('🔑 API Key inválida. Entre em contato com o administrador do sistema.');
        } else if (data.errorType === 'timeout') {
          setError('⏱️ A IA demorou muito para responder. Tente novamente em alguns segundos.');
        } else {
          setError(data.error || 'Erro ao processar cálculo. Tente novamente.');
        }
        return;
      }

      const calculation: CalculationResult = data;
      setResult(calculation);
    } catch (err) {
      setError('❌ Erro de conexão. Verifique sua internet e tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!result) return;

    setLoading(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          calculation: result,
          dataGeracao: new Date().toLocaleDateString('pt-BR'),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orcamento-solar-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Erro ao gerar PDF. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuote = () => {
    setResult(null);
    setCurrentStep(1);
    setFormData({
      cep: '',
      cidade: '',
      estado: '',
      consumoMedioMensal: 0,
      pretendAumentar: false,
      equipamentosAdicionais: [],
    });
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          ☀️ Seu Orçamento Está Pronto!
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/50 p-4 rounded-lg">
              <p className="text-sm text-blue-300">Potência do Sistema</p>
              <p className="text-2xl font-bold text-blue-400">{result.potencia_kwp.toFixed(2)} kWp</p>
              <p className="text-xs text-blue-300">{result.quantidade_placas}x {result.placa_watts}W</p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 border border-cyan-700/50 p-4 rounded-lg">
              <p className="text-sm text-cyan-300">Produção Mensal</p>
              <p className="text-2xl font-bold text-cyan-400">
                {result.producao_mensal_estimada ? `${result.producao_mensal_estimada} kWh` : 'Calculando...'}
              </p>
              <p className="text-xs text-cyan-300">HSP: {result.irradiacao_media} kWh/m²/dia</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/50 p-4 rounded-lg">
              <p className="text-sm text-purple-300">Investimento</p>
              <p className="text-2xl font-bold text-purple-400">
                R$ {result.custo_estimado.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-purple-300">R$ {Math.round(result.custo_estimado / result.potencia_kwp).toLocaleString()}/kWp</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border border-orange-700/50 p-4 rounded-lg">
              <p className="text-sm text-orange-300">Payback</p>
              <p className="text-2xl font-bold text-orange-400">{result.payback_anos.toFixed(1)} anos</p>
              <p className="text-xs text-orange-300">Retorno do investimento</p>
            </div>
          </div>

          {/* Cards adicionais com novas informações */}
          {(result.economia_mensal || result.economia_25_anos || result.co2_evitado_ano || result.area_necessaria) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {result.economia_mensal && (
                <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/50 p-4 rounded-lg">
                  <p className="text-sm text-green-300">Economia Mensal</p>
                  <p className="text-2xl font-bold text-green-400">R$ {result.economia_mensal.toLocaleString()}</p>
                  <p className="text-xs text-green-300">Na conta de luz</p>
                </div>
              )}

              {result.economia_25_anos && (
                <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border border-emerald-700/50 p-4 rounded-lg">
                  <p className="text-sm text-emerald-300">Economia 25 Anos</p>
                  <p className="text-2xl font-bold text-emerald-400">R$ {Math.round(result.economia_25_anos / 1000)}k</p>
                  <p className="text-xs text-emerald-300">Economia total</p>
                </div>
              )}

              {result.co2_evitado_ano && (
                <div className="bg-gradient-to-br from-teal-900/50 to-teal-800/30 border border-teal-700/50 p-4 rounded-lg">
                  <p className="text-sm text-teal-300">CO₂ Evitado/Ano</p>
                  <p className="text-2xl font-bold text-teal-400">{result.co2_evitado_ano}t</p>
                  <p className="text-xs text-teal-300">Benefício ambiental</p>
                </div>
              )}

              {result.area_necessaria && (
                <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 border border-indigo-700/50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-300">Área Necessária</p>
                  <p className="text-2xl font-bold text-indigo-400">{result.area_necessaria} m²</p>
                  <p className="text-xs text-indigo-300">Para instalação</p>
                </div>
              )}
            </div>
          )}

          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <span>🔧</span>
              Especificações Técnicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-sm">Inversor</div>
                <div className="text-white font-medium">{result.inversor}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Consumo Total</div>
                <div className="text-white font-medium">{result.consumo_total_kwh} kWh/mês</div>
              </div>
              {result.producao_anual_estimada && (
                <div>
                  <div className="text-gray-400 text-sm">Produção Anual</div>
                  <div className="text-white font-medium">{result.producao_anual_estimada.toLocaleString()} kWh</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <span>📊</span>
              Análise Técnica Detalhada
            </h3>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{result.explicacao}</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {saveSuccess && (
            <div className="bg-green-900/30 border border-green-700/50 text-green-300 px-4 py-3 rounded-lg flex items-center justify-between">
              <span>✅ Orçamento salvo com sucesso!</span>
              <Link href="/dashboard" className="text-green-400 hover:text-green-300 font-medium underline">
                Ver no Dashboard
              </Link>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-400 text-white py-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-500 transition-all shadow-lg"
            >
              💾 Salvar Orçamento
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Gerando PDF...' : '📄 Baixar PDF'}
            </button>
            <button
              onClick={handleNewQuote}
              className="px-6 py-4 border-2 border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 hover:border-gray-500 transition-all"
            >
              Novo
            </button>
          </div>
        </div>

        <SaveBudgetModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          formData={formData}
          calculation={result}
          onSuccess={() => {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 5000);
          }}
        />
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8">
      <StepIndicator currentStep={currentStep} totalSteps={4} />

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <Step1Location
            key="step1"
            data={formData}
            onChange={updateFormData}
          />
        )}
        {currentStep === 2 && (
          <Step2Consumption
            key="step2"
            data={formData}
            onChange={updateFormData}
          />
        )}
        {currentStep === 3 && (
          <Step3Expansion
            key="step3"
            data={formData}
            onChange={updateFormData}
          />
        )}
        {currentStep === 4 && (
          <Step4Review
            key="step4"
            data={formData}
          />
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <div className="flex gap-4 mt-8">
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 hover:border-gray-500 transition-all"
          >
            ← Voltar
          </button>
        )}
        
        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Próximo →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || !canProceed()}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Calculando...' : '🚀 Gerar Orçamento'}
          </button>
        )}
      </div>
    </div>
  );
}
