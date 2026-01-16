# 👑 Painel Administrativo

## Visão Geral

O Painel Administrativo é uma área exclusiva para usuários com role `admin`, oferecendo controle total sobre o sistema, usuários e orçamentos.

## Acesso

- **URL**: `/admin`
- **Requisito**: Role `admin` no perfil do usuário
- **Redirecionamento**: Usuários não-admin são redirecionados para `/dashboard`

## Funcionalidades

### 📊 Visão Geral

Dashboard com métricas gerais do sistema:

- **Total de Usuários**: Quantidade de usuários cadastrados
- **Total de Orçamentos**: Todos os orçamentos criados no sistema
- **Valor Total**: Soma de todos os investimentos em orçamentos
- **Taxa de Conversão**: Percentual de orçamentos aprovados

**Top Vendedores**:
- Ranking dos 5 melhores vendedores
- Ordenado por número de orçamentos aprovados
- Mostra total de vendas e valor gerado
- Medalhas: 🥇 🥈 🥉 para os 3 primeiros

### 👥 Gerenciamento de Usuários

Lista completa de todos os usuários do sistema com:

**Informações exibidas**:
- Avatar com inicial do nome
- Nome e email
- Badge de role (Admin, Gerente, Vendedor)
- Estatísticas individuais:
  - Número de orçamentos criados
  - Número de orçamentos aprovados
  - Valor total gerado

**Ações disponíveis**:
- **Alterar Role**: Dropdown para mudar entre vendedor, gerente e admin
- **Busca**: Campo de busca por nome ou email
- **Proteção**: Admin não pode alterar seu próprio role

### 📋 Todos os Orçamentos

Visualização de todos os orçamentos do sistema:

**Informações exibidas**:
- Nome do cliente
- Status (rascunho, enviado, aprovado, rejeitado)
- Nome do vendedor responsável
- Localização (cidade/estado)
- Potência do sistema (kWp)
- Valor do investimento
- Data de criação

**Filtros e organização**:
- Ordenados por data (mais recentes primeiro)
- Badge colorido por status
- Informação do vendedor responsável

## Design

### Tema
- Gradiente roxo/rosa para diferenciar do dashboard normal
- Ícone de coroa (👑) para identificação visual
- Bordas roxas nos cards

### Navegação
- Botão "👑 Admin" visível apenas para admins no header do dashboard e calculadora
- Botão "← Dashboard" para voltar ao dashboard pessoal
- Acesso ao perfil e logout mantidos

### Tabs
Três abas principais:
1. **📊 Visão Geral**: Métricas e rankings
2. **👥 Usuários**: Gerenciamento de usuários
3. **📋 Todos Orçamentos**: Lista completa de orçamentos

## Permissões

### Roles no Sistema

1. **Vendedor** (padrão)
   - Acesso ao dashboard pessoal
   - Cria e gerencia seus próprios orçamentos
   - Sem acesso ao painel admin

2. **Gerente**
   - Mesmas permissões do vendedor
   - (Pode ser expandido no futuro para relatórios de equipe)

3. **Admin**
   - Acesso total ao sistema
   - Visualiza todos os orçamentos
   - Gerencia usuários e roles
   - Acesso ao painel administrativo

## Segurança

- Verificação de role no servidor (page.tsx)
- Redirecionamento automático se não for admin
- Botão admin só aparece para usuários com role admin
- Admin não pode remover seu próprio privilégio

## Como Tornar um Usuário Admin

Execute no SQL Editor do Supabase:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'email@do-usuario.com';
```

Ou use o próprio painel admin (se já houver um admin) para alterar o role de outro usuário.

## Próximas Melhorias Possíveis

- [ ] Logs de atividades do sistema
- [ ] Gráficos de performance por período
- [ ] Exportação de relatórios em Excel/CSV
- [ ] Configurações globais do sistema
- [ ] Gerenciamento de permissões granulares
- [ ] Notificações e alertas
- [ ] Backup e restore de dados
- [ ] Auditoria de alterações
