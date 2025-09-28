import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import LandingPage from './components/LandingPage';
import { LandingPageContent } from './types';
import { initialLandingPageContent } from './constants';

const App: React.FC = () => {
  const [landingPageContent, setLandingPageContent] = useState<LandingPageContent>(initialLandingPageContent);

  // Load content from localStorage to persist edits
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('bomcorte_lp_content');
      if (savedContent) {
        setLandingPageContent(JSON.parse(savedContent));
      }
    } catch (error) {
      console.error("Failed to parse landing page content from localStorage", error);
    }
  }, []);

  const handleSaveContent = (newContent: LandingPageContent) => {
    setLandingPageContent(newContent);
    try {
      localStorage.setItem('bomcorte_lp_content', JSON.stringify(newContent));
      alert('Conteúdo da landing page atualizado com sucesso!');
    } catch (error) {
      console.error("Failed to save landing page content to localStorage", error);
      alert('Houve um erro ao salvar o conteúdo.');
    }
  };

  return (
    <div>
      <LandingPage content={landingPageContent} onNavigate={() => {}} />
      
      {/* Visual Separator */}
      <div className="bg-black py-16">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-black px-4 text-3xl font-bold tracking-wider uppercase text-amber-400">Painel Administrativo</span>
          </div>
        </div>
      </div>

      <AdminLayout content={landingPageContent} onSave={handleSaveContent} />
    </div>
  );
};

export default App;