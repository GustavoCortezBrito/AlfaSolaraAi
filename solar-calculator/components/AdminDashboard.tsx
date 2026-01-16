'use client';

export default function AdminDashboard({ user, profile, initialUsers, initialBudgets }: any) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">👑 Painel Administrativo</h1>
        <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
          <p className="text-white text-lg">Usuário: <span className="text-purple-400">{profile?.name || user.email}</span></p>
          <p className="text-white text-lg">Total de usuários: <span className="text-cyan-400">{initialUsers.length}</span></p>
          <p className="text-white text-lg">Total de orçamentos: <span className="text-blue-400">{initialBudgets.length}</span></p>
        </div>
      </div>
    </div>
  );
}
