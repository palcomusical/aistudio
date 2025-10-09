import React from 'react';

interface HomePageProps {
    onNavigate: (view: 'landing' | 'admin') => void;
    backgroundImageUrl: string;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, backgroundImageUrl }) => {

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(20, 5, 5, 0.85), rgba(20, 5, 5, 0.95)), url('${backgroundImageUrl}')`
  };

  return (
    <div 
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed p-4 text-white"
        style={backgroundStyle}
    >
        <div className="text-center mb-12">
            <h2 className="text-xl font-bold tracking-wider uppercase text-amber-400">BomCorte</h2>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2">Plataforma de Campanhas</h1>
            <p className="text-gray-300 mt-4 max-w-xl">
                Gerencie sua landing page de Black Friday ou visualize a página como um visitante.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
            <button
                onClick={() => onNavigate('landing')}
                className="w-64 bg-red-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-600 transition-all transform hover:scale-105 shadow-lg flex flex-col items-center justify-center text-center"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="text-lg">Ver Landing Page</span>
                <span className="text-xs font-normal opacity-75">(Visão do Cliente)</span>
            </button>

            <button
                onClick={() => onNavigate('admin')}
                className="w-64 bg-amber-500 text-gray-900 font-bold py-4 px-6 rounded-lg hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 transition-all transform hover:scale-105 shadow-lg flex flex-col items-center justify-center text-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-lg">Acessar Painel</span>
                <span className="text-xs font-normal opacity-75">(Login Necessário)</span>
            </button>
        </div>
    </div>
  );
};

export default HomePage;
