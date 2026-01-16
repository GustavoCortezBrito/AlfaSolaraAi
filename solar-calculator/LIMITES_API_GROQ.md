# 📊 Limites da API Groq - Guia Completo

## 🆓 Plano Gratuito (Atual)

### Limites de Rate (Taxa de Requisições):

**Llama 3.3 70B Versatile:**
- **30 requisições por minuto (RPM)**
- **14.400 tokens por minuto (TPM)**
- **14.400 requisições por dia (RPD)**

### O que isso significa na prática:

- ✅ Você pode fazer **30 orçamentos por minuto**
- ✅ Ou **14.400 orçamentos por dia**
- ⚠️ Se exceder, precisa aguardar 1 minuto

## 🚨 Mensagens de Erro Implementadas

### 1. Rate Limit (429)
```
⚠️ Limite de requisições atingido! 
A API Groq tem um limite gratuito. 
Aguarde 1 minuto e tente novamente.
```

**Quando acontece:**
- Mais de 30 requisições em 1 minuto
- Mais de 14.400 requisições em 1 dia

**Solução:**
- Aguardar 60 segundos
- Ou fazer upgrade para plano pago

### 2. API Key Inválida (401)
```
🔑 API Key inválida. 
Entre em contato com o administrador do sistema.
```

**Quando acontece:**
- GROQ_API_KEY incorreta no .env.local
- API Key expirada ou revogada

**Solução:**
- Gerar nova API Key em https://console.groq.com/keys
- Atualizar .env.local

### 3. Timeout
```
⏱️ A IA demorou muito para responder. 
Tente novamente em alguns segundos.
```

**Quando acontece:**
- Requisição muito complexa
- Servidor Groq sobrecarregado

**Solução:**
- Tentar novamente
- Simplificar o prompt (se possível)

### 4. Erro de Conexão
```
❌ Erro de conexão. 
Verifique sua internet e tente novamente.
```

**Quando acontece:**
- Sem internet
- Firewall bloqueando

**Solução:**
- Verificar conexão
- Verificar firewall

## 📈 Monitoramento de Uso

### Ver uso atual:
1. Acesse: https://console.groq.com/settings/limits
2. Veja gráficos de:
   - Requisições por minuto
   - Tokens usados
   - Requisições por dia

### Logs no Console:
O sistema já loga automaticamente:
```
🤖 [API] Enviando prompt para Groq (Llama 3)...
📊 [API] Tamanho do prompt: ~1234 caracteres
📥 [API] Resposta recebida da IA
✅ [API] Cálculo concluído com sucesso
```

Ou em caso de erro:
```
❌ [API] Erro ao calcular: Error: Rate limit exceeded
⚠️ [API] Rate limit detectado
```

## 💡 Dicas para Evitar Rate Limit

### 1. Cache de Resultados
- Salvar orçamentos no banco (já implementado ✅)
- Reutilizar cálculos similares

### 2. Debounce
- Evitar múltiplos cliques no botão "Gerar Orçamento"
- Já implementado com estado `loading` ✅

### 3. Validação Prévia
- Validar dados antes de chamar API
- Já implementado ✅

### 4. Feedback Visual
- Mostrar loading durante cálculo
- Já implementado ✅

### 5. Retry com Backoff
- Aguardar antes de tentar novamente
- Implementar se necessário

## 🔄 Planos Pagos (Futuro)

Se precisar de mais requisições:

### Pay-as-you-go:
- **$0.59 por 1M tokens** (input)
- **$0.79 por 1M tokens** (output)
- Sem limite de RPM/RPD

### Como fazer upgrade:
1. Acesse: https://console.groq.com/settings/billing
2. Adicione método de pagamento
3. Ative billing

## 🎯 Estimativa de Custos

### Uso médio por orçamento:
- **Input:** ~1.500 tokens (prompt)
- **Output:** ~500 tokens (resposta)
- **Total:** ~2.000 tokens

### Custo por orçamento (plano pago):
- Input: 1.500 × $0.59 / 1M = $0.000885
- Output: 500 × $0.79 / 1M = $0.000395
- **Total: ~$0.00128 por orçamento**

### Exemplos:
- **100 orçamentos/mês:** ~$0.13
- **1.000 orçamentos/mês:** ~$1.28
- **10.000 orçamentos/mês:** ~$12.80

**Muito barato!** 💰

## 🛡️ Proteções Implementadas

### No Backend (API Route):
- ✅ Detecção de rate limit
- ✅ Mensagens de erro específicas
- ✅ Logs detalhados
- ✅ Tratamento de exceções

### No Frontend (SolarForm):
- ✅ Mensagens amigáveis
- ✅ Feedback visual
- ✅ Botão desabilitado durante loading
- ✅ Validação prévia

## 📊 Alternativas (Se Groq Ficar Indisponível)

### 1. OpenAI GPT-4
- Mais caro (~$0.03 por orçamento)
- Mais preciso
- Mais lento

### 2. Anthropic Claude
- Preço similar ao GPT-4
- Muito bom para textos longos

### 3. Google Gemini
- Gratuito (com limites)
- Já tentamos, teve problemas de quota

### 4. Cálculo Local (Fallback)
- Sem IA
- Fórmulas fixas
- Sempre disponível

## 🔧 Configuração de Fallback

Se quiser adicionar fallback automático quando atingir limite:

```typescript
// Em calculate/route.ts
if (error.message.includes('429')) {
  // Usar cálculo local simplificado
  return calcularSemIA(formData);
}
```

## 📝 Checklist de Monitoramento

- [ ] Verificar uso diário em https://console.groq.com
- [ ] Monitorar logs do servidor
- [ ] Alertar usuários sobre limites
- [ ] Considerar upgrade se necessário
- [ ] Implementar cache se uso alto

---

**Status:** ✅ Sistema de avisos implementado!
**Data:** 16/01/2026
**Limites:** 30 RPM / 14.400 RPD (plano gratuito)
