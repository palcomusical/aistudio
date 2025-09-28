import React, { useState, FormEvent, useEffect } from 'react';
import { LeadSourceConfig, LeadSourceType, IntegrationType, Integration, LeadField } from '../../types';

interface ConfigFormProps {
  config: LeadSourceConfig | null;
  onSave: (config: LeadSourceConfig) => void;
  onCancel: () => void;
}

const defaultIntegrations: Integration[] = [
    { id: IntegrationType.N8N, name: 'n8n', isActive: false, credentials: { webhookUrl: '' } },
    { id: IntegrationType.GOOGLE_SHEETS, name: 'Google Sheets', isActive: false, credentials: { apiKey: '', sheetId: '' } },
    { id: IntegrationType.META_ADS, name: 'Meta Ads', isActive: false, credentials: { apiToken: '', pixelId: '' } },
];

const ConfigForm: React.FC<ConfigFormProps> = ({ config, onSave, onCancel }) => {
  const [formData, setFormData] = useState<LeadSourceConfig>({
    id: '',
    name: '',
    type: LeadSourceType.LANDING_PAGE,
    webhookUrl: '',
    integrations: JSON.parse(JSON.stringify(defaultIntegrations)),
    requiredFields: [],
  });

  useEffect(() => {
    if (config) {
        // Deep copy to avoid modifying the original state directly
        const newFormData = JSON.parse(JSON.stringify(config));
        // Ensure all default integrations are present
        newFormData.integrations = defaultIntegrations.map(defaultInt => {
            const existingInt = config.integrations.find(i => i.id === defaultInt.id);
            return existingInt ? {...defaultInt, ...existingInt} : defaultInt;
        });
        setFormData(newFormData);
    } else {
        setFormData({
            id: '',
            name: '',
            type: LeadSourceType.LANDING_PAGE,
            webhookUrl: '',
            integrations: JSON.parse(JSON.stringify(defaultIntegrations)),
            requiredFields: [{ id: `field-${Date.now()}`, name: 'name', label: 'Nome', isRequired: true }],
        })
    }
  }, [config]);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  // --- Integration Handlers ---
  const handleIntegrationToggle = (id: IntegrationType) => {
    setFormData(prev => ({
        ...prev,
        integrations: prev.integrations.map(int => int.id === id ? {...int, isActive: !int.isActive} : int)
    }));
  }
  
  const handleCredentialChange = (id: IntegrationType, key: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        integrations: prev.integrations.map(int => int.id === id ? {...int, credentials: {...int.credentials, [key]: value}} : int)
    }));
  }

  // --- Field Handlers ---
  const handleAddField = () => {
      setFormData(prev => ({
          ...prev,
          requiredFields: [...prev.requiredFields, {id: `field-${Date.now()}`, name: '', label: '', isRequired: true}]
      }))
  }

  const handleRemoveField = (id: string) => {
      setFormData(prev => ({
          ...prev,
          requiredFields: prev.requiredFields.filter(f => f.id !== id)
      }))
  }

  const handleFieldChange = (id: string, key: keyof Omit<LeadField, 'id'>, value: string | boolean) => {
      setFormData(prev => ({
          ...prev,
          requiredFields: prev.requiredFields.map(f => f.id === id ? {...f, [key]: value} : f)
      }))
  }
  
  const FormRow: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        {children}
    </div>
  )
  
  const TextInput: React.FC<{value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string}> = ({value, onChange, placeholder}) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
    />
  )

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-2xl border border-gray-700 space-y-8">
      <h2 className="text-2xl font-bold text-white">{config ? 'Editar Configuração' : 'Nova Configuração'}</h2>

      {/* --- Basic Info Section --- */}
      <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
        <h3 className="font-semibold text-amber-400">Informações Básicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormRow label="Nome da Origem">
                <TextInput value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Landing Page Black Friday" />
            </FormRow>
             <FormRow label="Tipo">
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as LeadSourceType})} className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition">
                    {Object.values(LeadSourceType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </FormRow>
        </div>
        <FormRow label="URL do Webhook (Entrada)">
             <TextInput value={formData.webhookUrl} onChange={e => setFormData({...formData, webhookUrl: e.target.value})} placeholder="https://seu-servico.com/webhook/..." />
        </FormRow>
      </div>

      {/* --- Integrations Section --- */}
      <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
        <h3 className="font-semibold text-amber-400">Integrações</h3>
        <div className="space-y-4">
            {formData.integrations.map(int => (
                <div key={int.id} className="bg-gray-900 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-white">{int.name}</span>
                        <div className={`relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in`}>
                            <input type="checkbox" checked={int.isActive} onChange={() => handleIntegrationToggle(int.id)} id={`toggle-${int.id}`} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor={`toggle-${int.id}`} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                    {int.isActive && (
                        <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                            {Object.keys(int.credentials).map(key => (
                                 <FormRow key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}>
                                    <TextInput value={int.credentials[key]} onChange={e => handleCredentialChange(int.id, key, e.target.value)} placeholder={`Insira seu ${key}`} />
                                </FormRow>
                            ))}
                            <button type="button" className="text-sm text-amber-400 hover:underline">Testar Conexão</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
      
       {/* --- Required Fields Section --- */}
      <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
          <div className="flex justify-between items-center">
             <h3 className="font-semibold text-amber-400">Campos do Lead</h3>
             <button type="button" onClick={handleAddField} className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded-md transition-colors">Adicionar Campo</button>
          </div>
          <div className="space-y-2">
            {formData.requiredFields.map(field => (
                <div key={field.id} className="grid grid-cols-10 gap-2 items-center">
                    <div className="col-span-4">
                        <TextInput value={field.label} onChange={e => handleFieldChange(field.id, 'label', e.target.value)} placeholder="Label (Ex: Nome Completo)"/>
                    </div>
                    <div className="col-span-4">
                        <TextInput value={field.name} onChange={e => handleFieldChange(field.id, 'name', e.target.value)} placeholder="ID do Campo (Ex: full_name)"/>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                        <input type="checkbox" checked={field.isRequired} onChange={e => handleFieldChange(field.id, 'isRequired', e.target.checked)} className="h-4 w-4 rounded text-amber-500 bg-gray-700 border-gray-600 focus:ring-amber-500"/>
                        <label className="ml-2 text-sm text-gray-400">Req?</label>
                    </div>
                    <div className="col-span-1">
                        <button type="button" onClick={() => handleRemoveField(field.id)} className="text-gray-500 hover:text-red-500 p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
                    </div>
                </div>
            ))}
          </div>
      </div>


      {/* --- Form Actions --- */}
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-600 transition">Cancelar</button>
        <button type="submit" className="bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-md hover:bg-amber-400 transition">Salvar</button>
      </div>
       <style>{`
          .toggle-checkbox:checked { right: 0; border-color: #f59e0b; }
          .toggle-checkbox:checked + .toggle-label { background-color: #f59e0b; }
      `}</style>
    </form>
  );
};

export default ConfigForm;
