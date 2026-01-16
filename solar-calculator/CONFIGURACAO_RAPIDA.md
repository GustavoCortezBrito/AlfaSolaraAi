# ⚡ Configuração Rápida - Resolver Erros

## 🚨 Erro: API 500 - GEMINI_API_KEY não configurada

### Solução:

1. **Criar arquivo `.env.local`** na raiz do projeto:
```bash
cd solar-calculator
```

2. **Copiar o exemplo**:
```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local

# Linux/Mac
cp .env.example .env.local
```

3. **Editar `.env.local`** e adicionar sua chave:
```env
GEMINI_API_KEY=sua_chave_api_aqui
```

4. **Obter a chave da API Gemini**:
   - Acesse: https://makersuite.google.com/app/apikey
   - Faça login com sua conta Google
   - Clique em "Create API Key"
   - Copie a chave gerada

5. **Colar a chave no arquivo**:
```env
GEMINI_API_KEY=AIzaSyD...sua_chave_completa_aqui
```

6. **Reiniciar o servidor**:
```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

## 🔧 Erro: Hydration Mismatch

### Causa:
IDs duplicados em SVGs quando múltiplos componentes são renderizados.

### Solução:
✅ **JÁ CORRIGIDO!** O componente `AlfaLogo.tsx` agora gera IDs únicos automaticamente.

## ✅ Checklist de Configuração

- [ ] Arquivo `.env.local` criado
- [ ] `GEMINI_API_KEY` adicionada
- [ ] Servidor reiniciado
- [ ] Página recarregada (F5)
- [ ] Teste: preencher formulário e gerar orçamento

## 🎯 Teste Rápido

1. Acesse: http://localhost:3000
2. Preencha:
   - CEP: 19060-000
   - Consumo: 350 kWh
   - Sem expansão
3. Clique em "Gerar Orçamento"
4. ✅ Deve funcionar!

## 🐛 Ainda com problemas?

### Verificar se a API Key está correta:
```bash
# Windows (PowerShell)
Get-Content .env.local

# Linux/Mac
cat .env.local
```

Deve mostrar:
```
GEMINI_API_KEY=AIzaSy...
```

### Verificar se o servidor leu a variável:
No console do servidor, deve aparecer:
```
✓ Ready in 2.3s
```

Se aparecer erro de API Key, reinicie o servidor.

## 📝 Estrutura de Arquivos

```
solar-calculator/
├── .env.local          ← CRIAR ESTE ARQUIVO
├── .env.example        ← Exemplo (não editar)
├── package.json
└── ...
```

## ⚠️ Importante

- **NÃO** commitar `.env.local` no Git
- **NÃO** compartilhar sua API Key
- **SIM** usar `.env.example` como referência

## 🔐 Segurança

O arquivo `.env.local` já está no `.gitignore`, então não será enviado para o Git.

Verifique:
```bash
# Deve estar listado
cat .gitignore | grep .env
```

Deve mostrar:
```
.env
.env*.local
```

---

## ✅ Pronto!

Após seguir esses passos, a aplicação deve funcionar perfeitamente! 🚀

Se ainda tiver problemas, verifique:
1. Node.js versão 18+
2. Dependências instaladas (`npm install`)
3. Porta 3000 disponível
4. Internet funcionando (para API Gemini)
