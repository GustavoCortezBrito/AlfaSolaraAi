# ⚡ Início Rápido - Supabase

## 🎯 Setup em 10 Minutos

### 1️⃣ Criar Conta (2 min)
```
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Login com GitHub ou email
4. ✅ Gratuito!
```

### 2️⃣ Criar Projeto (2 min)
```
1. Clique em "New Project"
2. Name: alfa-solar
3. Password: [crie uma senha forte]
4. Region: South America (São Paulo)
5. Plan: Free
6. Clique em "Create new project"
7. Aguarde ~2 minutos
```

### 3️⃣ Copiar Credenciais (1 min)
```
1. Menu lateral → ⚙️ Settings
2. Clique em "API"
3. Copie:
   - Project URL
   - anon public key
```

**Cole no `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4️⃣ Criar Tabelas (3 min)
```
1. Menu lateral → 🗄️ SQL Editor
2. Clique em "New query"
3. Copie TODO o conteúdo de: supabase/schema.sql
4. Cole no editor
5. Clique em "Run" (▶️)
6. ✅ Sucesso!
```

### 5️⃣ Criar Primeiro Usuário (2 min)
```
1. Menu lateral → 🔐 Authentication
2. Clique em "Users"
3. Clique em "Add user" → "Create new user"
4. Preencha:
   - Email: seu@email.com
   - Password: senha123
   - ✅ Marque "Auto Confirm User"
5. Clique em "Create user"
```

**Tornar Admin:**
```
1. Menu lateral → 🗄️ Table Editor
2. Selecione tabela "profiles"
3. Encontre seu usuário
4. Edite campo "role" para "admin"
5. Salve
```

### 6️⃣ Testar (1 min)
```bash
npm run dev
```

Acesse: http://localhost:3000/login

Login com as credenciais criadas

✅ Deve redirecionar para `/dashboard`

---

## 🎉 Pronto!

Agora você pode:
- ✅ Fazer login
- ✅ Criar orçamentos
- ✅ Salvar no banco
- ✅ Ver no dashboard
- ✅ Filtrar e buscar

---

## 🆘 Problemas?

### Erro de API Key
```bash
# Reinicie o servidor
Ctrl+C
npm run dev
```

### Tabelas não criadas
```
1. Vá em SQL Editor
2. Execute o schema.sql novamente
3. Verifique em Table Editor se as tabelas existem
```

### Login não funciona
```
1. Vá em Authentication → Providers
2. Certifique-se que "Email" está habilitado
3. Desabilite "Confirm email" (para desenvolvimento)
```

---

## 📚 Documentação Completa

- **Setup Detalhado:** `SUPABASE_SETUP.md`
- **Implementação:** `IMPLEMENTACAO_COMPLETA.md`
- **Roadmap:** `ROADMAP_SISTEMA_COMPLETO.md`

---

**Dúvidas? Veja os arquivos de documentação!** 📖
