# 🚀 Setup Supabase - Guia Completo

## 📋 Passo a Passo

### 1️⃣ Criar Conta no Supabase (5 minutos)

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub ou email
4. É **100% gratuito** para começar!

---

### 2️⃣ Criar Novo Projeto (2 minutos)

1. No dashboard, clique em **"New Project"**
2. Preencha:
   - **Name:** `alfa-solar` (ou qualquer nome)
   - **Database Password:** Crie uma senha forte (anote!)
   - **Region:** `South America (São Paulo)` (mais próximo)
   - **Pricing Plan:** Free (gratuito)
3. Clique em **"Create new project"**
4. Aguarde ~2 minutos (criação do banco)

---

### 3️⃣ Obter Credenciais (1 minuto)

1. No menu lateral, clique em **⚙️ Settings**
2. Clique em **API**
3. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (chave longa começando com `eyJ...`)

4. Cole no arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 4️⃣ Criar Tabelas no Banco (5 minutos)

1. No menu lateral, clique em **🗄️ SQL Editor**
2. Clique em **"New query"**
3. Copie TODO o conteúdo do arquivo `supabase/schema.sql`
4. Cole no editor SQL
5. Clique em **"Run"** (▶️)
6. Aguarde a mensagem de sucesso ✅

**O que foi criado:**
- ✅ Tabela `profiles` (usuários)
- ✅ Tabela `budgets` (orçamentos)
- ✅ Tabela `budget_history` (histórico)
- ✅ Triggers automáticos
- ✅ Políticas de segurança (RLS)

---

### 5️⃣ Configurar Autenticação (2 minutos)

1. No menu lateral, clique em **🔐 Authentication**
2. Clique em **Providers**
3. Certifique-se que **Email** está habilitado
4. Em **Email Auth**, configure:
   - ✅ **Enable Email provider**
   - ✅ **Confirm email:** OFF (para desenvolvimento)
   - ✅ **Secure email change:** ON

---

### 6️⃣ Criar Primeiro Usuário Admin (3 minutos)

#### Opção A: Via Interface (Recomendado)

1. No menu lateral, clique em **🔐 Authentication**
2. Clique em **Users**
3. Clique em **"Add user"** → **"Create new user"**
4. Preencha:
   - **Email:** seu@email.com
   - **Password:** senha123 (ou outra)
   - **Auto Confirm User:** ✅ Marque
5. Clique em **"Create user"**

#### Opção B: Via SQL

```sql
-- 1. Criar usuário no auth
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@alfasolar.com',
  crypt('senha123', gen_salt('bf')),
  NOW(),
  '{"name": "Administrador", "role": "admin"}'::jsonb,
  NOW(),
  NOW()
);
```

#### Tornar Admin:

1. Vá em **🗄️ Table Editor**
2. Selecione tabela **profiles**
3. Encontre seu usuário
4. Edite o campo **role** para `admin`
5. Salve

---

### 7️⃣ Testar Aplicação (2 minutos)

1. Reinicie o servidor Next.js:
```bash
npm run dev
```

2. Acesse: http://localhost:3000/login

3. Faça login com as credenciais criadas

4. Você deve ser redirecionado para `/dashboard` ✅

---

## 🎯 Verificação Rápida

### ✅ Checklist de Sucesso

- [ ] Projeto Supabase criado
- [ ] Credenciais copiadas para `.env.local`
- [ ] SQL executado sem erros
- [ ] Tabelas criadas (profiles, budgets, budget_history)
- [ ] Primeiro usuário criado
- [ ] Login funcionando
- [ ] Dashboard acessível

---

## 🔍 Visualizar Dados

### Ver Tabelas:
1. Menu **🗄️ Table Editor**
2. Selecione a tabela (profiles, budgets, etc)
3. Veja os dados em tempo real

### Ver Usuários:
1. Menu **🔐 Authentication**
2. Clique em **Users**
3. Lista de todos os usuários

### Executar Queries:
1. Menu **🗄️ SQL Editor**
2. Escreva queries SQL
3. Execute e veja resultados

---

## 🛠️ Comandos Úteis

### Ver todos os orçamentos:
```sql
SELECT * FROM budgets ORDER BY created_at DESC;
```

### Ver usuários e seus orçamentos:
```sql
SELECT 
  p.name,
  p.email,
  COUNT(b.id) as total_orcamentos
FROM profiles p
LEFT JOIN budgets b ON p.id = b.user_id
GROUP BY p.id, p.name, p.email;
```

### Tornar usuário admin:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'seu@email.com';
```

### Deletar orçamento:
```sql
DELETE FROM budgets WHERE id = 'uuid-do-orcamento';
```

---

## 🎨 Personalizar Email Templates (Opcional)

1. Menu **🔐 Authentication**
2. Clique em **Email Templates**
3. Personalize:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

---

## 📊 Monitorar Uso

1. Menu **⚙️ Settings**
2. Clique em **Usage**
3. Veja:
   - Database size
   - API requests
   - Storage used
   - Active users

**Limites Gratuitos:**
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- 50,000 monthly active users

---

## 🚨 Troubleshooting

### Erro: "Invalid API key"
- ✅ Verifique se copiou a chave correta (anon public)
- ✅ Reinicie o servidor Next.js

### Erro: "relation does not exist"
- ✅ Execute o SQL do schema.sql novamente
- ✅ Verifique se todas as tabelas foram criadas

### Erro: "User not found"
- ✅ Crie o usuário via Authentication → Users
- ✅ Marque "Auto Confirm User"

### Login não funciona
- ✅ Verifique se o email está confirmado
- ✅ Desabilite "Confirm email" em Providers
- ✅ Verifique a senha

### Dashboard vazio
- ✅ Crie um orçamento na calculadora
- ✅ Verifique se está logado
- ✅ Veja os dados em Table Editor

---

## 🔐 Segurança (Produção)

Quando for para produção:

1. **Habilitar Email Confirmation:**
   - Authentication → Providers → Email Auth
   - Marque "Confirm email"

2. **Configurar SMTP:**
   - Settings → Auth → SMTP Settings
   - Configure seu servidor de email

3. **Habilitar RLS em todas as tabelas:**
   - Já está configurado! ✅

4. **Revisar políticas de acesso:**
   - Table Editor → Selecione tabela → Policies

5. **Configurar domínio customizado:**
   - Settings → API → Custom Domain

---

## 📚 Recursos Úteis

- 📖 Documentação: https://supabase.com/docs
- 💬 Discord: https://discord.supabase.com
- 🎥 Tutoriais: https://supabase.com/docs/guides/getting-started
- 🐛 Issues: https://github.com/supabase/supabase/issues

---

## 🎉 Próximos Passos

Agora que o Supabase está configurado:

1. ✅ Teste criar um orçamento
2. ✅ Veja ele aparecer no dashboard
3. ✅ Crie mais usuários (vendedores)
4. ✅ Teste os filtros e busca
5. ✅ Explore as métricas

**Tudo pronto para usar! 🚀**
