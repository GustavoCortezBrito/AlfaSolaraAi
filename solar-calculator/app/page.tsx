import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se não estiver logado, redireciona para login
  if (!user) {
    redirect('/login');
  }

  // Se estiver logado, redireciona para dashboard
  redirect('/dashboard');
}
