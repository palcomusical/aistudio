
import React, { useState } from 'react';
import CampaignDashboard from './CampaignDashboard';
import AdminPanel from './AdminPanel';
import LandingPageEditor from './admin/LandingPageEditor';
import UserManagement from './admin/UserManagement';
import { useAuth } from '../contexts/AuthContext';
import { LandingPageContent, UserRole } from '../types';

interface AdminLayoutProps {
  content: LandingPageContent;
  onSave: (newContent: LandingPageContent) => void;
}

type View = 'dashboard' | 'admin' | 'editor' | 'users';

const AdminLayout: React.FC<AdminLayoutProps> = ({ content, onSave }) => {
  const { currentUser: authUser, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  // As requested, create a mock admin user to bypass login and keep the admin panel open.
  const currentUser = authUser || {
      id: 'mock-admin',
      email: 'admin@bomcorte.com (mock)',
      role: UserRole.ADMIN,
  };

  const handleLogout = () => {
      if (authUser) {
          logout();
      } else {
          // In a mock session, there's nothing to log out from.
          // Reloading the page would just bring it back to this state.
          alert("Você está em modo de visualização. Não há uma sessão real para encerrar.");
      }
  }

  const renderView = () => {
    switch (currentView) {
      case 'admin':
        return currentUser.role !== UserRole.VIEWER ? <AdminPanel /> : null;
      case 'editor':
        return currentUser.role !== UserRole.VIEWER ? <LandingPageEditor initialContent={content} onSave={onSave} /> : null;
      case 'users':
        return currentUser.role === UserRole.ADMIN ? <UserManagement /> : null;
      case 'dashboard':
      default:
        return <CampaignDashboard />;
    }
  };

  const TabButton: React.FC<{ view: View; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
     <button
        onClick={() => setCurrentView(view)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          currentView === view
            ? 'bg-amber-500 text-gray-900 shadow-lg'
            : 'text-gray-300 hover:bg-red-800'
        }`}
      >
        {icon}
        {label}
      </button>
  );

  const hasEditorPermissions = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.EDITOR;

  return (
    <div className="bg-red-950 font-sans text-white overflow-x-hidden">
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div className="flex items-center gap-4">
                     <div className="text-right sm:text-left">
                        <p className="text-sm font-bold text-white">{currentUser.email}</p>
                        <p className="text-xs text-amber-400">{currentUser.role}</p>
                    </div>
                     <button 
                        onClick={handleLogout}
                        className="bg-red-800 p-2 rounded-full hover:bg-red-700 transition"
                        aria-label="Sair"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                 <div className="bg-red-950 p-2 rounded-lg border border-red-800 flex flex-wrap justify-center space-x-2 shadow-md">
                    <TabButton 
                        view="dashboard" 
                        label="Dashboard" 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>}
                    />
                    {hasEditorPermissions && (
                      <>
                        <TabButton 
                            view="admin" 
                            label="Configurações de Leads"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>}
                        />
                         <TabButton 
                            view="editor"
                            label="Editor da Landing Page"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>}
                        />
                      </>
                    )}
                    {currentUser.role === UserRole.ADMIN && (
                       <TabButton 
                        view="users"
                        label="Gerenciar Usuários"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>}
                      />
                    )}
                 </div>
            </div>
             <div className="pt-8">{renderView()}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;