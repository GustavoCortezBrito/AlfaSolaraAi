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

    // Prompt otimizado com melhorias técnicas (Lei 14.300, HSP diário, produção mensal)
    const prompt = `Você é um engenheiro elétrico especialista em sistemas fotovoltaicos. Dimensione um sistema solar ON-GRID.

DADOS:
Localização: ${formData.cidade}, ${formData.estado}
Consumo atual: ${formData.consumoMedioMensal} kWh/mês
Consumo adicional planejado: ${consumoAdicional.toFixed(2)} kWh/mês${equipamentosDetalhados}
CONSUMO TOTAL: ${consumoTotal.toFixed(2)} kWh/mês

TAREFA:
1. Determine HSP médio diário (kWh/m²/dia) da região usando Atlas Solarimétrico Brasil/CRESESB
2. Calcule potência: P(kWp) = (Consumo_mensal / 30) / (HSP × 0.80)
3. Calcule produção mensal estimada: P(kWp) × HSP × 30 × 0.80
4. Dimensione com módulos de 550W, 600W ou 660W (tecnologia 2026)
5. Especifique inversor adequado (marca, potência, tipo)
6. Calcule investimento: R$ 3.800-4.200/kWp instalado
7. Calcule payback considerando:
   - Tarifa R$ 0,85/kWh
   - Consumo mínimo da concessionária (~30-50 kWh)
   - Regras atuais de compensação (Lei 14.300/2022)

RESPONDA APENAS COM JSON (sem markdown):
{
  "potencia_kwp": [número 2 decimais],
  "quantidade_placas": [inteiro],
  "placa_watts": [550, 600 ou 660],
  "inversor": "[Marca] [Potência]kW [Tipo]",
  "custo_estimado": [inteiro],
  "payback_anos": [número 1 decimal],
  "explicacao": "[Texto técnico incluindo: 1) HSP médio diário da região (não multiplicar por 30 ao citar), 2) Cálculo da potência, 3) Produção mensal estimada (kWh/mês), 4) Escolha dos módulos, 5) Dimensionamento do inversor, 6) Análise econômica com disclaimer sobre Lei 14.300/2022, 7) Menção ao consumo mínimo da concessionária e que o sistema reduz a conta a valores mínimos]",
  "consumo_total_kwh": ${consumoTotal.toFixed(2)},
  "irradiacao_media": [HSP em kWh/m²/dia],
  "producao_mensal_estimada": [número inteiro - kWh/mês]
}

IMPORTANTE:
- HSP é valor DIÁRIO (kWh/m²/dia) - não multiplicar por 30 ao citar
- Incluir produção mensal estimada no JSON e na explicação
- Mencionar Lei 14.300/2022 no payback
- Citar consumo mínimo da concessionária (30-50 kWh)
- Explicar que sistema reduz conta a valores mínimos`;

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
