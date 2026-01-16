import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CalculadoraClient from '@/components/CalculadoraClient';

export default async function CalculadoraPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Buscar perfil do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return <CalculadoraClient user={user} profile={profile} />;
}
