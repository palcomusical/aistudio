import React from 'react';
import { DashboardData, LeadStatus, Region } from '../types';

// Mock data simulating Google Sheets connection
const mockDashboardData: DashboardData = {
  totalContacts: 1258,
  trafficSource: [
    { source: 'Meta Ads', count: 750 },
    { source: 'Google Ads', count: 450 },
    { source: 'Orgânico', count: 58 },
  ],
  topRegions: [
    { region: Region.SUDESTE, count: 620 },
    { region: Region.SUL, count: 310 },
    { region: Region.NORDESTE, count: 180 },
    { region: Region.CENTRO_OESTE, count: 100 },
    { region: Region.NORTE, count: 48 },
  ],
  leadStatus: [
    { status: LeadStatus.ATENDIDO, count: 890 },
    { status: LeadStatus.PENDENTE, count: 368 },
  ],
  representativeRanking: [
    { name: 'Ana Silva', attended: 152 },
    { name: 'Bruno Costa', attended: 130 },
    { name: 'Carla Dias', attended: 115 },
    { name: 'Daniel Souza', attended: 98 },
    { name: 'Eduarda Lima', attended: 92 },
  ],
  leadsByLocation: [
    { state: 'SP', city: 'São Paulo', count: 250 },
    { state: 'RJ', city: 'Rio de Janeiro', count: 180 },
    { state: 'MG', city: 'Belo Horizonte', count: 120 },
    { state: 'RS', city: 'Porto Alegre', count: 90 },
    { state: 'BA', city: 'Salvador', count: 75 },
    { state: 'PR', city: 'Curitiba', count: 65 },
  ],
};

// Reusable card component
const DashboardCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-gray-800 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg shadow-2xl border border-gray-700 ${className}`}>
    <h3 className="text-lg font-bold text-amber-400 mb-4 tracking-wider">{title}</h3>
    <div>{children}</div>
  </div>
);

// Bar component for charts
const Bar: React.FC<{ label: string; value: number; maxValue: number; color: string }> = ({ label, value, maxValue, color }) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="flex items-center gap-4 mb-3">
      <div className="w-28 text-sm text-gray-300 truncate">{label}</div>
      <div className="flex-1 bg-gray-700 rounded-full h-5 relative overflow-hidden">
        <div
          className={`${color} h-5 rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        >
           <span className="text-xs font-bold text-gray-900">{value}</span>
        </div>
      </div>
    </div>
  );
};

const CampaignDashboard: React.FC = () => {
  const { totalContacts, trafficSource, topRegions, leadStatus, representativeRanking, leadsByLocation } = mockDashboardData;
  const maxTraffic = Math.max(...trafficSource.map(item => item.count));
  const maxStatus = Math.max(...leadStatus.map(item => item.count));
  const maxRegion = Math.max(...topRegions.map(item => item.count));
  const maxLocation = Math.max(...leadsByLocation.map(item => item.count));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Contacts */}
          <DashboardCard title="Total de Contatos">
            <p className="text-6xl font-extrabold text-white">{totalContacts.toLocaleString('pt-BR')}</p>
            <p className="text-gray-400 mt-2">Leads recebidos na campanha.</p>
          </DashboardCard>

          {/* Traffic Source */}
          <DashboardCard title="Origem do Tráfego" className="lg:col-span-2">
             {trafficSource.sort((a,b) => b.count - a.count).map(item => (
                <Bar key={item.source} label={item.source} value={item.count} maxValue={maxTraffic} color="bg-amber-500" />
             ))}
          </DashboardCard>
          
          {/* Lead Status */}
          <DashboardCard title="Status dos Leads">
            {leadStatus.sort((a,b) => b.count - a.count).map(item => (
                <Bar key={item.status} label={item.status} value={item.count} maxValue={maxStatus} color={item.status === LeadStatus.ATENDIDO ? 'bg-green-500' : 'bg-yellow-500'} />
            ))}
          </DashboardCard>

          {/* Representative Ranking */}
          <DashboardCard title="Ranking de Representantes" className="md:col-span-2 lg:col-span-4">
            <ol className="space-y-3">
              {representativeRanking.map((rep, index) => (
                <li key={rep.name} className="flex justify-between items-center bg-gray-900 p-2 rounded-md hover:bg-gray-700 transition-colors">
                   <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${index < 3 ? 'bg-amber-400 text-gray-900' : 'bg-gray-700 text-gray-300'}`}>{index + 1}</span>
                    <span className="text-white font-medium">{rep.name}</span>
                   </div>
                  <span className="font-bold text-amber-300">{rep.attended} atendidos</span>
                </li>
              ))}
            </ol>
          </DashboardCard>

          {/* Top Regions */}
          <DashboardCard title="Regiões mais Fortes" className="md:col-span-2 lg:col-span-2">
            {topRegions.sort((a,b) => b.count - a.count).map(region => (
                <Bar key={region.region} label={region.region} value={region.count} maxValue={maxRegion} color="bg-amber-500" />
            ))}
          </DashboardCard>

          {/* Leads by Location */}
          <DashboardCard title="Leads por Estado/Cidade" className="md:col-span-2 lg:col-span-2">
            {leadsByLocation.sort((a,b) => b.count - a.count).slice(0, 5).map(item => (
                <Bar key={`${item.city}-${item.state}`} label={`${item.city}, ${item.state}`} value={item.count} maxValue={maxLocation} color="bg-cyan-500" />
            ))}
          </DashboardCard>

        </div>
      </div>
    </div>
  );
};

export default CampaignDashboard;