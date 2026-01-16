-- ============================================
-- SCHEMA ALFA SOLAR - SUPABASE
-- ============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: profiles (estende auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'vendedor' CHECK (role IN ('admin', 'vendedor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- TABELA: budgets (orçamentos)
-- ============================================
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Dados do cliente
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  
  -- Localização
  cep TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  
  -- Consumo
  consumo_medio_mensal NUMERIC NOT NULL,
  pretend_aumentar BOOLEAN DEFAULT FALSE,
  equipamentos_adicionais JSONB,
  
  -- Resultado do cálculo
  calculation_result JSONB NOT NULL,
  
  -- Status e notas
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'enviado', 'aprovado', 'rejeitado')),
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX idx_budgets_status ON public.budgets(status);
CREATE INDEX idx_budgets_created_at ON public.budgets(created_at DESC);
CREATE INDEX idx_budgets_client_name ON public.budgets(client_name);

-- RLS
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Usuários podem ver seus próprios orçamentos"
  ON public.budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar orçamentos"
  ON public.budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios orçamentos"
  ON public.budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios orçamentos"
  ON public.budgets FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os orçamentos"
  ON public.budgets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- TABELA: budget_history (histórico)
-- ============================================
CREATE TABLE IF NOT EXISTS public.budget_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  budget_id UUID REFERENCES public.budgets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('criado', 'editado', 'enviado', 'aprovado', 'rejeitado')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_budget_history_budget_id ON public.budget_history(budget_id);
CREATE INDEX idx_budget_history_created_at ON public.budget_history(created_at DESC);

-- RLS
ALTER TABLE public.budget_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver histórico de seus orçamentos"
  ON public.budget_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.budgets
      WHERE id = budget_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Sistema pode inserir histórico"
  ON public.budget_history FOR INSERT
  WITH CHECK (true);

-- ============================================
-- FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para budgets
CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'vendedor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Função para registrar histórico automaticamente
CREATE OR REPLACE FUNCTION public.log_budget_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.budget_history (budget_id, user_id, action)
    VALUES (NEW.id, NEW.user_id, 'criado');
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO public.budget_history (budget_id, user_id, action)
    VALUES (NEW.id, NEW.user_id, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para histórico
CREATE TRIGGER on_budget_change
  AFTER INSERT OR UPDATE ON public.budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.log_budget_history();

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View com dados completos dos orçamentos
CREATE OR REPLACE VIEW budgets_with_user AS
SELECT 
  b.*,
  p.name as user_name,
  p.email as user_email,
  p.role as user_role
FROM public.budgets b
LEFT JOIN public.profiles p ON b.user_id = p.id;

-- ============================================
-- DADOS INICIAIS (OPCIONAL)
-- ============================================

-- Inserir primeiro admin (ajuste o email)
-- Você precisará criar este usuário no Supabase Auth primeiro
-- INSERT INTO public.profiles (id, email, name, role)
-- VALUES (
--   'UUID_DO_USUARIO_CRIADO_NO_AUTH',
--   'admin@alfasolar.com',
--   'Administrador',
--   'admin'
-- );
