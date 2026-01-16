# ✅ Checklist de Deploy - Alfa Solar

## Antes do Deploy

### 1. Teste Local
- [ ] `npm run build` executa sem erros
- [ ] Todas as páginas carregam corretamente
- [ ] Login/Registro funcionando
- [ ] Criação de orçamento funcionando
- [ ] Geração de PDF funcionando
- [ ] Painel admin acessível (para usuários admin)

### 2. Variáveis de Ambiente
- [ ] `.env.local` configurado localmente
- [ ] `.env.example` criado para referência
- [ ] `.env.local` está no `.gitignore`
- [ ] Anote suas variáveis para configurar na Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `GROQ_API_KEY`

### 3. Repositório Git
- [ ] Git inicializado
- [ ] Todos os arquivos commitados
- [ ] Repositório criado no GitHub
- [ ] Código enviado para GitHub

## Durante o Deploy na Vercel

### 1. Conectar Repositório
- [ ] Login na Vercel
- [ ] Importar projeto do GitHub
- [ ] Selecionar repositório correto

### 2. Configurar Projeto
- [ ] Framework: Next.js (detectado automaticamente)
- [ ] Root Directory: `solar-calculator` (se em subpasta)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`

### 3. Adicionar Variáveis de Ambiente
- [ ] `NEXT_PUBLIC_SUPABASE_URL` adicionada
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` adicionada
- [ ] `GROQ_API_KEY` adicionada
- [ ] Todas marcadas para Production, Preview e Development

### 4. Deploy
- [ ] Clicar em "Deploy"
- [ ] Aguardar build completar (2-5 minutos)
- [ ] Verificar se não há erros no log

## Após o Deploy

### 1. Configurar Supabase
- [ ] Acessar Supabase Dashboard
- [ ] Ir em Authentication → URL Configuration
- [ ] Adicionar URL da Vercel em "Site URL"
- [ ] Adicionar `https://seu-projeto.vercel.app/**` em "Redirect URLs"

### 2. Testar Aplicação
- [ ] Acessar URL da Vercel
- [ ] Testar registro de novo usuário
- [ ] Testar login
- [ ] Criar um orçamento de teste
- [ ] Gerar PDF
- [ ] Verificar salvamento no banco
- [ ] Testar painel admin (tornar usuário admin primeiro)

### 3. Tornar Primeiro Usuário Admin
Execute no SQL Editor do Supabase:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'seu@email.com';
```

### 4. Monitoramento
- [ ] Verificar logs na Vercel (Functions → Logs)
- [ ] Testar em diferentes dispositivos
- [ ] Testar em diferentes navegadores
- [ ] Verificar performance (Lighthouse)

## Problemas Comuns

### Build Falha
1. Verifique erros no log da Vercel
2. Teste `npm run build` localmente
3. Confirme que todas as dependências estão no package.json

### Erro de Autenticação
1. Verifique variáveis de ambiente na Vercel
2. Confirme URL de redirect no Supabase
3. Limpe cache do navegador

### PDF não Gera
1. Verifique se `GROQ_API_KEY` está configurada
2. Monitore limites da API Groq
3. Verifique logs de erro na Vercel

### Painel Admin não Carrega
1. Confirme que usuário tem role 'admin' no banco
2. Verifique se está logado
3. Limpe cache e tente novamente

## URLs Importantes

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Groq Console**: https://console.groq.com
- **Seu Projeto**: https://seu-projeto.vercel.app

## Comandos Úteis

```bash
# Build local
npm run build

# Iniciar produção local
npm run start

# Limpar cache
rm -rf .next node_modules/.cache

# Ver logs da Vercel (CLI)
vercel logs
```

## Próximos Passos

- [ ] Configurar domínio personalizado
- [ ] Adicionar Vercel Analytics
- [ ] Configurar alertas de erro
- [ ] Implementar backup do Supabase
- [ ] Documentar para equipe
