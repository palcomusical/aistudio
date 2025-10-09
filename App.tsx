

import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import AdminLayout from './components/AdminLayout';
import LandingPage from './components/LandingPage';
import LoginPage from './components/auth/LoginPage';
import { LandingPageContent } from './types';
import { initialLandingPageContent } from './constants';
import { useAuth } from './contexts/AuthContext';

type View = 'home' | 'landing' | 'admin';

const AdminPage: React.FC<{
  content: LandingPageContent;
  onSave: (newContent: LandingPageContent) => void;
  onNavigate: (view: View) => void;
}> = ({ content, onSave, onNavigate }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginPage backgroundImageUrl={content.backgroundImageUrl} onNavigate={onNavigate} />;
  }

  return <AdminLayout content={content} onSave={onSave} onNavigate={onNavigate} />;
};


const App: React.FC = () => {
  const [landingPageContent, setLandingPageContent] = useState<LandingPageContent>(initialLandingPageContent);
  const [view, setView] = useState<View>('home');

  // Load content from localStorage to persist edits
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('bomcorte_lp_content');
      if (savedContent) {
        setLandingPageContent(JSON.parse(savedContent));
      }
// FIX: Added curly braces to the catch block to fix a syntax error that was breaking the component's scope.
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
  
  const handleNavigate = (targetView: View) => {
    window.scrollTo(0, 0); // Scroll to top on page change
    setView(targetView);
  };

  const renderView = () => {
    switch(view) {
      case 'landing':
        return <LandingPage content={landingPageContent} onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminPage content={landingPageContent} onSave={handleSaveContent} onNavigate={handleNavigate} />;
      case 'home':
      default:
        return <HomePage onNavigate={handleNavigate} backgroundImageUrl={landingPageContent.backgroundImageUrl} />;
    }
  }

  return (
    <div className="antialiased">
      {renderView()}
    </div>
  );
};

export default App;