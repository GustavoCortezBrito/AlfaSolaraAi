-- ============================================
-- FIX: Corrigir políticas de RLS que causam recursão
-- ============================================

-- Remover política problemática
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;

-- Recriar política sem recursão usando auth.jwt()
CREATE POLICY "Admins podem ver todos os perfis"
  ON public.profiles FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    OR auth.uid() = id
  );

-- Atualizar política de budgets para admins também
DROP POLICY IF EXISTS "Admins podem ver todos os orçamentos" ON public.budgets;

CREATE POLICY "Admins podem ver todos os orçamentos"
  ON public.budgets FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    OR auth.uid() = user_id
  );

-- Garantir que o role está no user_metadata ao criar usuário
-- (já está no trigger handle_new_user, mas vamos garantir)
