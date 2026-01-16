import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminDashboard from '@/components/AdminDashboard';

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  // Buscar perfil do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Verificar se é admin
  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  // Buscar todos os usuários
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  // Buscar todos os orçamentos
  const { data: allBudgets } = await supabase
    .from('budgets')
    .select('*, profiles(name, email)')
    .order('created_at', { ascending: false });

  return (
    <AdminDashboard 
      user={user} 
      profile={profile} 
      initialUsers={users || []}
      initialBudgets={allBudgets || []}
    />
  );
}
