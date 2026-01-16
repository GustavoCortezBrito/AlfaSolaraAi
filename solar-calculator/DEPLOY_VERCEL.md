# 🚀 Deploy na Vercel - Guia Completo

## ✅ Pré-requisitos

1. Conta na Vercel (https://vercel.com)
2. Conta no GitHub (para conectar o repositório)
3. Supabase configurado e funcionando
4. API Key do Groq

## 📋 Passo a Passo

### 1. Preparar o Repositório

```bash
# Inicializar git (se ainda não tiver)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit - Alfa Solar Calculator"

# Criar repositório no GitHub e conectar
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git branch -M main
git push -u origin main
```

### 2. Configurar Variáveis de Ambiente na Vercel

Acesse o dashboard da Vercel e adicione as seguintes variáveis:

**Obrigatórias:**
```
NEXT_PUBLIC_SUPABASE_URL=https://yihrgiwmhcntylfjyqpe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu_anon_key_aqui
GROQ_API_KEY=sua_groq_api_key_aqui
```

**Como adicionar:**
1. Vá em Settings → Environment Variables
2. Adicione cada variável
3. Selecione todos os ambientes (Production, Preview, Development)

### 3. Deploy Automático

1. Conecte seu repositório GitHub à Vercel
2. A Vercel detectará automaticamente que é um projeto Next.js
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `solar-calculator` (se o projeto estiver em subpasta)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)

4. Clique em "Deploy"

### 4. Configurar Domínio Personalizado (Opcional)

1. Vá em Settings → Domains
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções da Vercel

## 🔒 Segurança - Variáveis de Ambiente

### ⚠️ IMPORTANTE: Nunca commite o arquivo `.env.local`

O arquivo `.gitignore` já está configurado para ignorar:
```
.env*.local
.env
```

### Variáveis Públicas vs Privadas

**Públicas (NEXT_PUBLIC_*):**
- Expostas no browser
- Usadas em componentes client-side
- Exemplo: `NEXT_PUBLIC_SUPABASE_URL`

**Privadas:**
- Apenas no servidor
- Nunca expostas no browser
- Exemplo: `GROQ_API_KEY`

## 🔧 Configurações Específicas do Supabase

### Atualizar URL de Redirecionamento

No Supabase Dashboard:
1. Vá em Authentication → URL Configuration
2. Adicione a URL da Vercel em "Site URL":
   ```
   https://seu-projeto.vercel.app
   ```
3. Adicione em "Redirect URLs":
   ```
   https://seu-projeto.vercel.app/**
   ```

## 📊 Monitoramento

### Logs na Vercel
- Acesse Functions → Logs para ver erros em tempo real
- Monitore uso de recursos em Analytics

### Limites do Plano Free
- **Bandwidth**: 100GB/mês
- **Executions**: 100GB-Hrs
- **Edge Requests**: Ilimitado
- **Serverless Functions**: 100 horas/mês

## 🐛 Troubleshooting

### Erro: "Module not found"
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Supabase connection failed"
- Verifique se as variáveis de ambiente estão corretas
- Confirme que a URL do Supabase está acessível
- Verifique as políticas RLS no Supabase

### Erro: "Groq API rate limit"
- Verifique se a API key está correta
- Monitore o uso no dashboard do Groq
- Considere implementar cache para reduzir chamadas

### Build falha
```bash
# Teste o build localmente primeiro
npm run build

# Se funcionar local mas falhar na Vercel:
# 1. Verifique as variáveis de ambiente
# 2. Confirme que todas as dependências estão no package.json
# 3. Verifique se não há imports absolutos quebrados
```

## 🔄 CI/CD Automático

Após configurar, cada push para `main` fará:
1. Build automático
2. Deploy em produção
3. Preview deployments para PRs

## 📱 Domínios Gerados

A Vercel gera automaticamente:
- **Produção**: `seu-projeto.vercel.app`
- **Preview**: `seu-projeto-git-branch.vercel.app`

## ✅ Checklist Final

- [ ] Variáveis de ambiente configuradas
- [ ] Supabase URL de redirect atualizada
- [ ] Build local funcionando (`npm run build`)
- [ ] Todas as dependências no package.json
- [ ] .env.local no .gitignore
- [ ] Repositório no GitHub
- [ ] Deploy na Vercel concluído
- [ ] Teste de login funcionando
- [ ] Teste de criação de orçamento
- [ ] Teste de geração de PDF
- [ ] Painel admin acessível

## 🎯 Próximos Passos

1. Configure um domínio personalizado
2. Adicione analytics (Vercel Analytics)
3. Configure alertas de erro (Sentry)
4. Implemente backup automático do Supabase
5. Configure CDN para assets estáticos

## 📞 Suporte

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
