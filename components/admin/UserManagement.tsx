import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

const UserManagement: React.FC = () => {
  const { users, register, deleteUser, currentUser } = useAuth();
  
  // State for the new user form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.VIEWER);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      try {
        await deleteUser(userId);
        setSuccess('Usuário excluído com sucesso.');
      } catch (err: any) {
        setError(err.message || 'Falha ao excluir usuário.');
      }
    }
  };
  
  const handleRegisterUser = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    if (!email || !password) {
        setError('Email e senha são obrigatórios.');
        setIsSubmitting(false);
        return;
    }
    try {
      await register({ email, password, role });
      setSuccess(`Usuário ${email} criado com sucesso!`);
      // Reset form
      setEmail('');
      setPassword('');
      setRole(UserRole.VIEWER);
    } catch (err: any) {
       setError(err.message || 'Falha ao criar usuário.');
    } finally {
        setIsSubmitting(false);
    }
  }

  const roleColorMap: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'bg-red-500 text-red-100',
    [UserRole.EDITOR]: 'bg-amber-500 text-amber-100',
    [UserRole.VIEWER]: 'bg-gray-500 text-gray-100',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* User List */}
      <div className="lg:col-span-2 bg-gray-800 bg-opacity-70 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Usuários do Sistema</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nível de Acesso</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColorMap[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {currentUser?.id !== user.id ? (
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-400">Excluir</button>
                    ) : (
                        <span className="text-gray-500 text-xs italic">Você</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Form */}
      <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Criar Novo Usuário</h2>
        <form onSubmit={handleRegisterUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Senha Provisória</label>
            <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nível de Acesso</label>
            <select 
                value={role} 
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition">
              {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}
          
          <div className="pt-2">
            <button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500 transition disabled:opacity-50">
              {isSubmitting ? 'Criando...' : 'Adicionar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;