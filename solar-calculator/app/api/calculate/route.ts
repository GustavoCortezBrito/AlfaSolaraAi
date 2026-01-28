import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { FormData, CalculationResult } from '@/types';

export async function POST(request: NextRequest) {
  let formData: FormData | null = null;
  
  try {
    console.log('🔍 [API] Iniciando cálculo...');
    
    // Validar API Key
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ [API] GROQ_API_KEY não configurada');
      return NextResponse.json(
        { error: 'Configuração da API não encontrada. Configure a GROQ_API_KEY no arquivo .env.local' },
        { status: 500 }
      );
    }

    console.log('✅ [API] API Key encontrada');
    
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    formData = await request.json();
    
    if (!formData) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }
    
    console.log('📋 [API] Dados recebidos:', JSON.stringify(formData, null, 2));

    // Calcular consumo adicional dos equipamentos
    let consumoAdicional = 0;
    if (formData.pretendAumentar && formData.equipamentosAdicionais) {
      formData.equipamentosAdicionais.forEach(eq => {
        // kWh/mês = (Watts * horas/dia * dias/mês * quantidade) / 1000
        consumoAdicional += (eq.potenciaWatts * eq.horasUsoDia * 30 * eq.quantidade) / 1000;
      });
    }

    // Montar lista detalhada de equipamentos para o prompt
    let equipamentosDetalhados = '';
    if (formData.pretendAumentar && formData.equipamentosAdicionais && formData.equipamentosAdicionais.length > 0) {
      equipamentosDetalhados = '\n\nEQUIPAMENTOS ADICIONAIS PLANEJADOS:\n';
      formData.equipamentosAdicionais.forEach((eq, index) => {
        const consumoMensalEq = (eq.potenciaWatts * eq.horasUsoDia * 30 * eq.quantidade) / 1000;
        equipamentosDetalhados += `${index + 1}. ${eq.nome}:\n`;
        equipamentosDetalhados += `   - Potência: ${eq.potenciaWatts}W\n`;
        equipamentosDetalhados += `   - Quantidade: ${eq.quantidade} unidade(s)\n`;
        equipamentosDetalhados += `   - Uso diário: ${eq.horasUsoDia} horas/dia\n`;
        equipamentosDetalhados += `   - Consumo mensal estimado: ${consumoMensalEq.toFixed(2)} kWh\n`;
      });
    }

    const consumoTotal = formData.consumoMedioMensal + consumoAdicional;

    // Prompt otimizado com melhorias técnicas avançadas para Alfa Solar
    const prompt = `Você é um ENGENHEIRO ELÉTRICO ESPECIALISTA em sistemas fotovoltaicos da ALFA SOLAR (Presidente Prudente/SP). 
Dimensione um sistema solar ON-GRID seguindo as melhores práticas de engenharia e padrões da empresa.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 DADOS DO PROJETO - ALFA SOLAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cliente: Localização ${formData.cidade}, ${formData.estado}
Consumo atual: ${formData.consumoMedioMensal} kWh/mês
Consumo adicional planejado: ${consumoAdicional.toFixed(2)} kWh/mês${equipamentosDetalhados}
CONSUMO TOTAL A ATENDER: ${consumoTotal.toFixed(2)} kWh/mês

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 METODOLOGIA DE DIMENSIONAMENTO ALFA SOLAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ETAPA 1: HSP médio diário para ${formData.cidade}/${formData.estado} (Atlas Solarimétrico INPE/CRESESB)
ETAPA 2: Energia diária necessária: E_diária = ${consumoTotal.toFixed(2)} / 30 = ${(consumoTotal/30).toFixed(2)} kWh/dia
ETAPA 3: Potência mínima: P(kWp) = E_diária / (HSP × η_sistema)
         η_sistema = 0.80 (perdas: cabeamento 3%, inversor 5%, sujeira 5%, temperatura 7%)
ETAPA 4: Seleção de módulos TIER 1 (Canadian Solar, Jinko, Trina - 550W/600W/660W monocristalino)
ETAPA 5: Inversor dimensionado: P_inv = 0.85 a 1.0 × P_gerador (Growatt, Fronius, SMA)
ETAPA 6: Investimento Alfa Solar: R$ 3.800-4.200/kWp (projeto + instalação + homologação + garantia)
ETAPA 7: Análise econômica regional:
         - Tarifa CPFL/Energisa: R$ 0,85-0,95/kWh (com bandeiras)
         - Taxa mínima: 30-50 kWh/mês (custo de disponibilidade)
         - Lei 14.300/2022: compensação integral até 2045
         - Garantia Alfa Solar: 5 anos instalação + 25 anos módulos + 10 anos inversor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RESPOSTA TÉCNICA OBRIGATÓRIA (JSON sem markdown)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "potencia_kwp": [número 2 decimais - potência mínima calculada],
  "quantidade_placas": [inteiro - quantidade real de módulos],
  "placa_watts": [550, 600 ou 660 - potência unitária do módulo],
  "inversor": "[Marca] [Potência]kW [Tipo - String/Micro]",
  "custo_estimado": [inteiro - valor total do investimento],
  "payback_anos": [número 1 decimal - retorno simples],
  "economia_mensal": [inteiro - R$ economia mensal na conta],
  "economia_25_anos": [inteiro - R$ economia total em 25 anos],
  "co2_evitado_ano": [número 1 decimal - toneladas CO2 evitadas por ano],
  "area_necessaria": [número 1 decimal - área em m² para instalação],
  "explicacao": "[ANÁLISE TÉCNICA COMPLETA da Alfa Solar incluindo: 1) HSP específico da região ${formData.cidade}/${formData.estado}, 2) Metodologia de cálculo detalhada, 3) Justificativa técnica dos módulos selecionados, 4) Dimensionamento e especificação do inversor, 5) Análise econômica com tarifas regionais, 6) Benefícios ambientais calculados, 7) Garantias oferecidas pela Alfa Solar, 8) Considerações sobre Lei 14.300/2022 e sistema de compensação]",
  "consumo_total_kwh": ${consumoTotal.toFixed(2)},
  "irradiacao_media": [HSP em kWh/m²/dia - valor diário médio anual],
  "producao_mensal_estimada": [inteiro - kWh produzidos por mês],
  "producao_anual_estimada": [inteiro - kWh produzidos por ano]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 DIRETRIZES ESPECÍFICAS ALFA SOLAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Use dados precisos do Atlas Solarimétrico para ${formData.cidade}/${formData.estado}
✅ Considere perdas reais: cabeamento (3%) + inversor (5%) + sujeira (5%) + temperatura (7%) = 20%
✅ Priorize módulos TIER 1 com eficiência >21% (Canadian Solar, Jinko, Trina)
✅ Especifique inversores com garantia mínima 10 anos (Growatt, Fronius, SMA)
✅ Calcule CO2 evitado: 0.0817 tCO2/MWh (fator de emissão SIN)
✅ Área necessária: 6-8 m²/kWp (considerando espaçamento e orientação)
✅ Mencione garantia total Alfa Solar: 5 anos instalação + garantias fabricantes
✅ Explique benefícios Lei 14.300/2022: compensação integral até 2045
✅ Considere superdimensionamento de 5-10% para compensar variações sazonais
✅ Use tarifa média regional R$ 0,85-0,95/kWh (incluindo bandeiras tarifárias)
✅ Inclua análise de payback considerando inflação energética de 4-6% ao ano
✅ Destaque que Alfa Solar atende toda região de Presidente Prudente/SP

IMPORTANTE: O sistema deve ser dimensionado para produzir ligeiramente ACIMA do consumo 
para garantir compensação integral mesmo em meses menos ensolarados.`;

    console.log('🤖 [API] Enviando prompt para Groq (Llama 3)...');
    console.log(`📊 [API] Tamanho do prompt: ~${prompt.length} caracteres`);
    
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Você é um engenheiro elétrico especialista em sistemas fotovoltaicos. Responda APENAS com JSON válido, sem markdown.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });
    
    const text = completion.choices[0]?.message?.content || '';

    console.log('📥 [API] Resposta recebida da IA');
    console.log('📄 [API] Texto bruto:', text.substring(0, 200) + '...');

    // Limpar resposta e parsear JSON
    let cleanedText = text.trim();
    
    // Remover markdown code blocks se existirem
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    console.log('🧹 [API] Texto limpo:', cleanedText.substring(0, 200) + '...');
    
    const calculation: CalculationResult = JSON.parse(cleanedText);

    console.log('✅ [API] Cálculo concluído com sucesso');
    return NextResponse.json(calculation);
  } catch (error) {
    console.error('❌ [API] Erro ao calcular:', error);
    console.error('❌ [API] Stack:', error instanceof Error ? error.stack : 'N/A');
    
    // Detectar tipo de erro da API
    let errorMessage = 'Erro ao processar cálculo';
    let errorType = 'unknown';
    
    if (error instanceof Error) {
      const errorStr = error.message.toLowerCase();
      
      // Rate limit / Quota exceeded
      if (errorStr.includes('429') || errorStr.includes('rate limit') || errorStr.includes('quota')) {
        errorType = 'rate_limit';
        errorMessage = '⚠️ Limite de requisições atingido. A API Groq tem um limite gratuito de requisições por minuto. Aguarde alguns segundos e tente novamente.';
        console.log('⚠️ [API] Rate limit detectado');
      }
      // API Key inválida
      else if (errorStr.includes('401') || errorStr.includes('unauthorized') || errorStr.includes('invalid api key')) {
        errorType = 'invalid_key';
        errorMessage = '🔑 API Key inválida. Verifique a configuração da GROQ_API_KEY no arquivo .env.local';
        console.log('⚠️ [API] API Key inválida');
      }
      // Modelo não encontrado
      else if (errorStr.includes('404') || errorStr.includes('not found')) {
        errorType = 'model_not_found';
        errorMessage = '❌ Modelo de IA não encontrado. Verifique se o modelo está disponível.';
        console.log('⚠️ [API] Modelo não encontrado');
      }
      // Timeout
      else if (errorStr.includes('timeout') || errorStr.includes('timed out')) {
        errorType = 'timeout';
        errorMessage = '⏱️ Tempo limite excedido. A IA demorou muito para responder. Tente novamente.';
        console.log('⚠️ [API] Timeout');
      }
      // Erro de parsing JSON
      else if (errorStr.includes('json') || errorStr.includes('parse')) {
        errorType = 'parse_error';
        errorMessage = '📄 Erro ao processar resposta da IA. Tente novamente.';
        console.log('⚠️ [API] Erro de parsing');
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        errorType: errorType,
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: errorType === 'rate_limit' ? 429 : 500 }
    );
  }
}
