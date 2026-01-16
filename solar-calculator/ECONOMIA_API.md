# 💰 Guia de Economia da API Gemini

## 📊 Limites da Quota Gratuita

**Gemini Free Tier (por dia):**
- ✅ 1.500 requisições/dia
- ✅ 1 milhão de tokens de entrada/dia
- ✅ 15 requisições/minuto

**Nosso consumo por cálculo:**
- ~800 caracteres de prompt = ~200 tokens
- Com 1.500 requisições/dia, você pode fazer **1.500 orçamentos/dia**

## 🎯 Otimizações Implementadas

### 1. Prompt Enxuto
- ✅ Reduzido de ~2.500 para ~800 caracteres
- ✅ Mantém detalhamento técnico essencial
- ✅ Remove formatação desnecessária (emojis, linhas decorativas)

### 2. Validação Antes de Chamar
- ✅ Verifica dados completos antes de chamar API
- ✅ Evita chamadas com dados inválidos

### 3. Fallback Inteligente
- ✅ Se quota exceder, usa cálculos locais
- ✅ Usuário sempre recebe resposta
- ✅ Aviso claro quando é fallback

## 🔑 Gerenciamento de API Keys

### Criar Nova API Key
1. Acesse: https://aistudio.google.com/apikey
2. Clique em "Create API Key"
3. Copie a chave
4. Cole no arquivo `.env.local`:
   ```
   GEMINI_API_KEY=sua_nova_chave_aqui
   ```
5. Reinicie o servidor: `npm run dev`

### Monitorar Uso
- Dashboard: https://ai.dev/rate-limit
- Veja requisições em tempo real
- Acompanhe quota restante

## 💡 Dicas para Economizar

### Durante Desenvolvimento
1. **Use o fallback local** - Teste interface sem gastar quota
2. **Comente a chamada da API** - Teste apenas com dados mockados
3. **Limite testes** - Só teste com API quando necessário

### Em Produção
1. **Cache de resultados** - Mesmos dados = mesma resposta (implementar se necessário)
2. **Rate limiting** - Limite requisições por IP (implementar se necessário)
3. **Validação rigorosa** - Só chama API com dados 100% válidos ✅ (já implementado)

## 🚨 Se Exceder a Quota

**O sistema continua funcionando!**
- ✅ Detecta erro 429 automaticamente
- ✅ Retorna cálculos locais precisos
- ✅ Avisa usuário que são dados de exemplo
- ✅ Nenhum erro para o usuário final

**Soluções:**
1. **Aguardar 24h** - Quota reseta diariamente às 00:00 UTC
2. **Trocar API key** - Usar outra conta Google
3. **Ativar billing** - Plano pago (não recomendado para MVP)

## 📈 Estimativa de Uso

**Cenário conservador:**
- 50 orçamentos/dia = 10.000 tokens/dia
- **Sobra 99% da quota!**

**Cenário intenso:**
- 500 orçamentos/dia = 100.000 tokens/dia
- **Sobra 90% da quota!**

**Você está seguro!** A quota gratuita é mais que suficiente para uso normal.

## 🔧 Configurações Atuais

```typescript
// Modelo usado
model: 'gemini-2.0-flash-exp'

// Tamanho do prompt
~800 caracteres (~200 tokens)

// Timeout
Sem timeout (resposta rápida ~1-2s)

// Fallback
Ativado automaticamente em caso de erro
```

## ✅ Checklist de Economia

- [x] Prompt otimizado (reduzido 70%)
- [x] Validação antes de chamar API
- [x] Fallback automático
- [x] Logs de tamanho do prompt
- [x] Tratamento de erros robusto
- [ ] Cache de resultados (implementar se necessário)
- [ ] Rate limiting por IP (implementar se necessário)

---

**Última atualização:** Janeiro 2026
