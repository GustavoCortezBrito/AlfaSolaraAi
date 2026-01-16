'use client';

import { motion } from 'framer-motion';
import { FormData } from '@/types';

interface Step4Props {
  data: FormData;
}

export default function Step4Review({ data }: Step4Props) {
  const calcularConsumoAdicional = () => {
    if (!data.pretendAumentar || !data.equipamentosAdicionais) return 0;
    
    return data.equipamentosAdicionais.reduce((total, eq) => {
      return total + (eq.potenciaWatts * eq.horasUsoDia * 30 * eq.quantidade) / 1000;
    }, 0);
  };

  const consumoAdicional = calcularConsumoAdicional();
  const consumoTotal = data.consumoMedioMensal + consumoAdicional;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Revisão dos Dados</h2>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-cyan-400 mb-2">📍 Localização</h3>
          <p className="text-gray-300">{data.cidade}, {data.estado}</p>
          {data.cep && <p className="text-gray-300">CEP: {data.cep}</p>}
        </div>

        <div className="border-t border-gray-700 pt-4">
          <h3 className="font-semibold text-cyan-400 mb-2">⚡ Consumo</h3>
          <p className="text-gray-300">Consumo atual: {data.consumoMedioMensal} kWh/mês</p>
          {consumoAdicional > 0 && (
            <>
              <p className="text-gray-300">Consumo adicional: {consumoAdicional.toFixed(2)} kWh/mês</p>
              <p className="text-cyan-400 font-semibold">Consumo total: {consumoTotal.toFixed(2)} kWh/mês</p>
            </>
          )}
        </div>

        {data.pretendAumentar && data.equipamentosAdicionais && data.equipamentosAdicionais.length > 0 && (
          <div className="border-t border-gray-700 pt-4">
            <h3 className="font-semibold text-cyan-400 mb-2">🔌 Equipamentos Adicionais</h3>
            <ul className="space-y-2">
              {data.equipamentosAdicionais.map((eq, index) => (
                <li key={index} className="text-gray-300">
                  • {eq.quantidade}x {eq.nome} ({eq.potenciaWatts}W, {eq.horasUsoDia}h/dia)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-cyan-900/30 border border-cyan-700/50 rounded-lg p-4">
        <p className="text-sm text-cyan-200">
          ✓ Revise os dados acima. Ao clicar em "Gerar Orçamento", nossa IA calculará
          o sistema fotovoltaico ideal para suas necessidades.
        </p>
      </div>
    </motion.div>
  );
}
