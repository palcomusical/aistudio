import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
    backgroundImageUrl: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ backgroundImageUrl }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(20, 5, 5, 0.85), rgba(20, 5, 5, 0.95)), url('${backgroundImageUrl}')`
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      await login(email, password);
      // The App component will handle the redirect
    } catch (err: any) {
      setError(err.message || 'Falha ao fazer login.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div 
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed p-4"
        style={backgroundStyle}
    >
        <div className="text-center mb-8">
            <h2 className="text-xl font-bold tracking-wider uppercase text-amber-400">BomCorte</h2>
            <h1 className="text-4xl font-extrabold text-white">Acesso ao Painel</h1>
        </div>

        <div className="w-full max-w-sm bg-red-900 bg-opacity-70 backdrop-blur-sm p-8 rounded-lg shadow-2xl border border-red-800">
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                    <div className="mt-1">
                        <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-red-950 border border-red-700 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">Senha</label>
                    <div className="mt-1">
                        <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-red-950 border border-red-700 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                        />
                    </div>
                </div>

                {error && <p className="text-red-400 text-center text-sm">{error}</p>}

                <div>
                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-gray-900 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-900 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-wait"
                    >
                         {isLoggingIn ? 'Entrando...' : 'Entrar'}
                    </button>
                </div>
            </form>
             <div className="text-center mt-4">
                <p className="text-xs text-gray-400">Use `admin@bomcorte.com` e senha `password123`</p>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;