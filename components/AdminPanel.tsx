import React, { useState } from 'react';
import { LeadSourceConfig, LeadSourceType, IntegrationType } from '../types';
import ConfigList from './admin/ConfigList';
import ConfigForm from './admin/ConfigForm';

// Mock data for initial state
const mockConfigs: LeadSourceConfig[] = [
  {
    id: 'config-1',
    name: 'Landing Page Black Friday',
    type: LeadSourceType.LANDING_PAGE,
    webhookUrl: 'https://n8n.example.com/webhook/12345',
    integrations: [
      { id: IntegrationType.N8N, name: 'n8n', isActive: true, credentials: { webhookUrl: 'https://n8n.example.com/webhook/12345' } },
      { id: IntegrationType.GOOGLE_SHEETS, name: 'Google Sheets', isActive: true, credentials: { sheetId: 'abc-123' } },
      { id: IntegrationType.META_ADS, name: 'Meta Ads', isActive: false, credentials: {} },
    ],
    requiredFields: [
      { id: 'f1', name: 'name', label: 'Nome Completo', isRequired: true },
      { id: 'f2', name: 'email', label: 'E-mail', isRequired: true },
      { id: 'f3', name: 'whatsapp', label: 'WhatsApp', isRequired: true },
      { id: 'f4', name: 'state', label: 'Estado', isRequired: true },
      { id: 'f5', name: 'city', label: 'Cidade', isRequired: true },
    ],
  },
    {
    id: 'config-2',
    name: 'Leads Orgânicos',
    type: LeadSourceType.ORGANICO,
    webhookUrl: 'https://n8n.example.com/webhook/67890',
    integrations: [
      { id: IntegrationType.N8N, name: 'n8n', isActive: true, credentials: { webhookUrl: 'https://n8n.example.com/webhook/67890' } },
      { id: IntegrationType.GOOGLE_SHEETS, name: 'Google Sheets', isActive: false, credentials: {} },
      { id: IntegrationType.META_ADS, name: 'Meta Ads', isActive: false, credentials: {} },
    ],
    requiredFields: [
      { id: 'f1', name: 'name', label: 'Nome', isRequired: true },
      { id: 'f2', name: 'email', label: 'E-mail', isRequired: true },
    ],
  },
];

const AdminPanel: React.FC = () => {
  const [configs, setConfigs] = useState<LeadSourceConfig[]>(mockConfigs);
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [selectedConfig, setSelectedConfig] = useState<LeadSourceConfig | null>(null);

  const handleAddNew = () => {
    setSelectedConfig(null);
    setCurrentView('form');
  };

  const handleEdit = (config: LeadSourceConfig) => {
    setSelectedConfig(config);
    setCurrentView('form');
  };

  const handleDelete = (configId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta configuração?')) {
        setConfigs(prev => prev.filter(c => c.id !== configId));
    }
  };

  const handleSave = (config: LeadSourceConfig) => {
    if (selectedConfig) {
      // Update existing
      setConfigs(prev => prev.map(c => (c.id === config.id ? config : c)));
    } else {
      // Add new
      setConfigs(prev => [...prev, { ...config, id: `config-${Date.now()}` }]);
    }
    setCurrentView('list');
    setSelectedConfig(null);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedConfig(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {currentView === 'list' ? (
        <ConfigList
          configs={configs}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <ConfigForm
          config={selectedConfig}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AdminPanel;
