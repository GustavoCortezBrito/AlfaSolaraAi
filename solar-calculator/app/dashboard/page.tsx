import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  const cookieStore = await cookies();

  // Verificar usuário de desenvolvimento
  const devUserCookie = cookieStore.get('alfa_solar_dev_user');
  let devUser = null;
  
  if (devUserCookie) {
    try {
      devUser = JSON.parse(devUserCookie.value);
    } catch (e) {
      // Cookie inválido, ignorar
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se não há usuário do Supabase nem usuário de desenvolvimento, redirecionar
  if (!user && !devUser) {
    redirect('/login');
  }

  let profile = null;
  let budgets = [];

  if (user) {
    // Usuário real do Supabase
    // Buscar perfil do usuário
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    profile = profileData;

    // Buscar orçamentos do usuário
    const { data: budgetsData } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    budgets = budgetsData || [];
  } else if (devUser) {
    // Usuário de desenvolvimento - criar dados mock
    profile = {
      id: devUser.id,
      email: devUser.email,
      name: devUser.name,
      role: devUser.role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Orçamentos mock vazios para desenvolvimento
    budgets = [];
  }

  return (
    <DashboardClient 
      user={user || devUser} 
      profile={profile} 
      initialBudgets={budgets} 
    />
  );
}
