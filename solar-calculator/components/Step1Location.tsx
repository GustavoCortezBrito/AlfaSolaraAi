'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Step1Props {
  data: {
    cidade: string;
    estado: string;
    cep?: string;
  };
  onChange: (field: string, value: string) => void;
}

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function Step1Location({ data, onChange }: Step1Props) {
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState('');
  const [cepEncontrado, setCepEncontrado] = useState(false);

  const buscarCep = async (cep: string) => {
    // Limpar CEP (remover caracteres não numéricos)
    const cepLimpo = cep.replace(/\D/g, '');
    
    // Validar se tem 8 dígitos
    if (cepLimpo.length !== 8) {
      setErroCep('');
      setCepEncontrado(false);
      return;
    }

    setBuscandoCep(true);
    setErroCep('');

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dados = await response.json();

      if (dados.erro) {
        setErroCep('CEP não encontrado. Preencha manualmente.');
        setCepEncontrado(false);
      } else {
        // Preencher cidade e estado automaticamente
        onChange('cidade', dados.localidade);
        onChange('estado', dados.uf);
        setCepEncontrado(true);
        setErroCep('');
      }
    } catch (error) {
      setErroCep('Erro ao buscar CEP. Preencha manualmente.');
      setCepEncontrado(false);
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleCepChange = (valor: string) => {
    // Formatar CEP (00000-000)
    let cepFormatado = valor.replace(/\D/g, '');
    if (cepFormatado.length > 5) {
      cepFormatado = cepFormatado.slice(0, 5) + '-' + cepFormatado.slice(5, 8);
    }
    
    onChange('cep', cepFormatado);
    
    // Buscar automaticamente quando tiver 8 dígitos
    const cepLimpo = cepFormatado.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      buscarCep(cepFormatado);
    } else {
      setCepEncontrado(false);
      setErroCep('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Localização</h2>
      
      {/* CEP em primeiro lugar */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          CEP *
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.cep || ''}
            onChange={(e) => handleCepChange(e.target.value)}
            className={`w-full px-4 py-3 bg-gray-800 border ${
              erroCep ? 'border-red-500' : cepEncontrado ? 'border-green-500' : 'border-gray-700'
            } text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-all`}
            placeholder="00000-000"
            maxLength={9}
            required
          />
          {buscandoCep && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
          {cepEncontrado && !buscandoCep && (
            <div className="absolute right-3 top-3 text-green-500">
              ✓
            </div>
          )}
        </div>
        {erroCep && (
          <p className="text-sm text-red-400 mt-2">{erroCep}</p>
        )}
        {cepEncontrado && (
          <p className="text-sm text-green-400 mt-2">✓ CEP encontrado! Cidade e estado preenchidos automaticamente.</p>
        )}
        {!cepEncontrado && !erroCep && (
          <p className="text-sm text-gray-400 mt-2">
            Digite seu CEP para preencher automaticamente
          </p>
        )}
      </div>

      {/* Cidade - preenchida automaticamente ou manualmente */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Cidade *
        </label>
        <input
          type="text"
          value={data.cidade}
          onChange={(e) => onChange('cidade', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-all"
          placeholder="Ex: Presidente Prudente"
          required
          disabled={buscandoCep}
        />
        {!cepEncontrado && (
          <p className="text-sm text-gray-400 mt-2">
            Ou preencha manualmente se preferir
          </p>
        )}
      </div>

      {/* Estado - preenchido automaticamente ou manualmente */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Estado *
        </label>
        <select
          value={data.estado}
          onChange={(e) => onChange('estado', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          required
          disabled={buscandoCep}
        >
          <option value="">Selecione...</option>
          {estados.map(estado => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}
