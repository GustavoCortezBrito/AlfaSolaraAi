# 🚀 Configuração Groq (100% Grátis)

## Por Que Groq?

✅ **Totalmente grátis** - Sem cartão de crédito  
✅ **Muito rápido** - Resposta em ~1 segundo  
✅ **Boa qualidade** - Usa Llama 3.3 70B  
✅ **Sem limites baixos** - Quota generosa  

## Passo a Passo

### 1. Criar Conta Groq

1. Acesse: https://console.groq.com
2. Clique em **"Sign Up"**
3. Use sua conta Google ou email
4. **NÃO precisa de cartão!**

### 2. Gerar API Key

1. Após login, vá em: https://console.groq.com/keys
2. Clique em **"Create API Key"**
3. Dê um nome (ex: "Solar Calculator")
4. Copie a chave gerada

### 3. Configurar no Projeto

1. Abra o arquivo `.env.local`
2. Cole sua chave:
   ```
   GROQ_API_KEY=gsk_sua_chave_aqui
   ```
3. Salve o arquivo

### 4. Reiniciar Servidor

```bash
# Pare o servidor (Ctrl+C)
npm run dev
```

### 5. Testar

1. Abra http://localhost:3000
2. Preencha o formulário
3. Clique em "Gerar Orçamento"
4. Deve funcionar com IA real! 🎉

## Modelos Disponíveis

O código usa `llama-3.3-70b-versatile`:
- ✅ Mais inteligente
- ✅ Melhor para cálculos técnicos
- ✅ Resposta detalhada

Outros modelos disponíveis:
- `llama-3.1-70b-versatile` - Mais rápido
- `mixtral-8x7b-32768` - Alternativa boa

## Limites Gratuitos

**Groq Free Tier:**
- 30 requisições/minuto
- 14.400 requisições/dia
- Mais que suficiente!

## Troubleshooting

### Erro: "API key not found"
- Verifique se copiou a chave completa
- Verifique se salvou o `.env.local`
- Reinicie o servidor

### Erro: "Rate limit"
- Aguarde 1 minuto
- Groq tem limite de 30 req/min

### Resposta vazia
- Verifique os logs no terminal
- Pode ser problema no prompt

## Comparação: Groq vs Gemini

| Aspecto | Groq | Gemini |
|---------|------|--------|
| Custo | ✅ Grátis | ⚠️ Precisa billing |
| Cartão | ✅ Não precisa | ❌ Precisa |
| Velocidade | ✅ ~1s | ⚠️ ~2s |
| Qualidade | ✅ Ótima | ✅ Ótima |
| Quota | ✅ 14.400/dia | ⚠️ 1.500/dia |

## Conclusão

Groq é a melhor opção para este projeto:
- Sem burocracia de cartão
- Grátis de verdade
- Rápido e confiável

---

**Pronto para usar!** 🚀
