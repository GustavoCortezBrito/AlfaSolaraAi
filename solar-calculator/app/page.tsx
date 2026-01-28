import CalculadoraClient from '@/components/CalculadoraClient';

export default function HomePage() {
  // Acesso direto à calculadora sem autenticação
  const mockUser = {
    id: 'public-user',
    email: 'publico@alfasolar.com',
    role: 'public'
  };

  const mockProfile = {
    id: 'public-user',
    email: 'publico@alfasolar.com',
    name: 'Usuário Público',
    role: 'public',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return (
    <CalculadoraClient 
      user={mockUser} 
      profile={mockProfile} 
    />
  );
}
