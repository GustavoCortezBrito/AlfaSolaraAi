'use client';

import { motion } from 'framer-motion';

interface Step2Props {
  data: {
    consumoMedioMensal: number;
  };
  onChange: (field: string, value: number) => void;
}

export default function Step2Consumption({ data, onChange }: Step2Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Consumo de Energia</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Consumo Médio Mensal (kWh) *
        </label>
        <input
          type="number"
          value={data.consumoMedioMensal || ''}
          onChange={(e) => onChange('consumoMedioMensal', parseFloat(e.target.value) || 0)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-all"
          placeholder="Ex: 350"
          min="0"
          required
        />
        <p className="text-sm text-gray-400 mt-2">
          Você pode encontrar essa informação na sua conta de luz
        </p>
      </div>

      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-300 mb-2">💡 Dica</h3>
        <p className="text-sm text-blue-200">
          Para um cálculo mais preciso, faça a média dos últimos 12 meses de consumo.
          Considere variações sazonais (verão/inverno).
        </p>
      </div>
    </motion.div>
  );
}
