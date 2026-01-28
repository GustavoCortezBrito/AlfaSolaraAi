'use client';

export default function AdminClient({ user, profile, initialUsers, initialBudgets }: any) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Painel Admin</h1>
        <p className="text-gray-400">Usuário: {profile?.name || user.email}</p>
        <p className="text-gray-400">Total de usuários: {initialUsers.length}</p>
        <p className="text-gray-400">Total de orçamentos: {initialBudgets.length}</p>
      </div>
    </div>
  );
}
