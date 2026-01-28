'use client';

import { motion } from 'framer-motion';
import { EquipamentoAdicional } from '@/types';

interface Step3Props {
  data: {
    pretendAumentar: boolean;
    equipamentosAdicionais?: EquipamentoAdicional[];
  };
  onChange: (field: string, value: any) => void;
}

const equipamentosComuns = [
  { nome: 'Ar Condicionado Split 9.000 BTU', potenciaWatts: 900 },
  { nome: 'Ar Condicionado Split 12.000 BTU', potenciaWatts: 1200 },
  { nome: 'Ar Condicionado Split 18.000 BTU', potenciaWatts: 1800 },
  { nome: 'Ar Condicionado Split 24.000 BTU', potenciaWatts: 2400 },
  { nome: 'Chuveiro Elétrico 5500W', potenciaWatts: 5500 },
  { nome: 'Chuveiro Elétrico 7500W', potenciaWatts: 7500 },
  { nome: 'Aquecedor Elétrico 3000W', potenciaWatts: 3000 },
  { nome: 'Aquecedor Elétrico 4000W', potenciaWatts: 4000 },
  { nome: 'Piscina - Bomba 1/2 CV', potenciaWatts: 370 },
  { nome: 'Piscina - Bomba 3/4 CV', potenciaWatts: 550 },
  { nome: 'Piscina - Bomba 1 CV', potenciaWatts: 750 },
  { nome: 'Veículo Elétrico - Carregamento Lento', potenciaWatts: 3300 },
  { nome: 'Veículo Elétrico - Carregamento Rápido', potenciaWatts: 7400 },
  { nome: 'Forno Elétrico Industrial', potenciaWatts: 4000 },
  { nome: 'Máquina de Lavar Roupa', potenciaWatts: 500 },
  { nome: 'Secadora de Roupas', potenciaWatts: 2500 },
  { nome: 'Micro-ondas', potenciaWatts: 1200 },
  { nome: 'Geladeira Duplex', potenciaWatts: 150 },
  { nome: 'Freezer Horizontal', potenciaWatts: 200 },
  { nome: 'Sauna Elétrica', potenciaWatts: 6000 },
  { nome: 'Jacuzzi/Hidromassagem', potenciaWatts: 2200 },
  { nome: 'Iluminação LED Adicional', potenciaWatts: 100 },
  { nome: 'Computador/Workstation', potenciaWatts: 400 },
  { nome: 'Ar Condicionado Central', potenciaWatts: 5000 },
  { nome: 'Outro (Personalizado)', potenciaWatts: 0 },
];

export default function Step3Expansion({ data, onChange }: Step3Props) {
  const addEquipamento = () => {
    const equipamentos = data.equipamentosAdicionais || [];
    onChange('equipamentosAdicionais', [
      ...equipamentos,
      { nome: '', potenciaWatts: 0, quantidade: 1, horasUsoDia: 0 }
    ]);
  };

  const removeEquipamento = (index: number) => {
    const equipamentos = data.equipamentosAdicionais || [];
    onChange('equipamentosAdicionais', equipamentos.filter((_, i) => i !== index));
  };

  const updateEquipamento = (index: number, field: keyof EquipamentoAdicional, value: any) => {
    const equipamentos = [...(data.equipamentosAdicionais || [])];
    equipamentos[index] = { ...equipamentos[index], [field]: value };
    onChange('equipamentosAdicionais', equipamentos);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Expansão Futura</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Pretende aumentar o consumo de energia?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => onChange('pretendAumentar', true)}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              data.pretendAumentar
                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            onClick={() => {
              onChange('pretendAumentar', false);
              onChange('equipamentosAdicionais', []);
            }}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              !data.pretendAumentar
                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            Não
          </button>
        </div>
      </div>

      {data.pretendAumentar && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-white">Equipamentos Adicionais</h3>
            <button
              type="button"
              onClick={addEquipamento}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg"
            >
              + Adicionar
            </button>
          </div>

          {data.equipamentosAdicionais?.map((eq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-800 border border-gray-700 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-200">Equipamento {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeEquipamento(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tipo</label>
                  <select
                    value={eq.nome}
                    onChange={(e) => {
                      const selected = equipamentosComuns.find(ec => ec.nome === e.target.value);
                      updateEquipamento(index, 'nome', e.target.value);
                      if (selected && selected.potenciaWatts > 0) {
                        updateEquipamento(index, 'potenciaWatts', selected.potenciaWatts);
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">Selecione...</option>
                    {equipamentosComuns.map(ec => (
                      <option key={ec.nome} value={ec.nome}>{ec.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Potência (W)</label>
                  <input
                    type="number"
                    value={eq.potenciaWatts || ''}
                    onChange={(e) => updateEquipamento(index, 'potenciaWatts', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Quantidade</label>
                  <input
                    type="number"
                    value={eq.quantidade || ''}
                    onChange={(e) => updateEquipamento(index, 'quantidade', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Horas de uso/dia</label>
                  <input
                    type="number"
                    value={eq.horasUsoDia || ''}
                    onChange={(e) => updateEquipamento(index, 'horasUsoDia', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    min="0"
                    max="24"
                    step="0.5"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
