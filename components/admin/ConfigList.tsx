import React from 'react';
import { LeadSourceConfig } from '../../types';

interface ConfigListProps {
  configs: LeadSourceConfig[];
  onAddNew: () => void;
  onEdit: (config: LeadSourceConfig) => void;
  onDelete: (configId: string) => void;
}

const ConfigList: React.FC<ConfigListProps> = ({ configs, onAddNew, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-2xl border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Configurações de Origem de Leads</h2>
        <button
          onClick={onAddNew}
          className="bg-amber-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500 transition-transform transform hover:scale-105 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nova Configuração
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome da Origem</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Integrações Ativas</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {configs.map(config => (
              <tr key={config.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{config.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{config.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                        {config.integrations.filter(int => int.isActive).map(int => (
                            <span key={int.id} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-green-100">
                                {int.name}
                            </span>
                        ))}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <button onClick={() => onEdit(config)} className="text-amber-400 hover:text-amber-300">Editar</button>
                  <button onClick={() => onDelete(config.id)} className="text-red-500 hover:text-red-400">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfigList;
