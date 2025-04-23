
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabaseService } from '@/services/SupabaseService';
import ChartCard from '@/components/ChartCard';
import DataTable from '@/components/DataTable';
import StatCard from '@/components/StatCard';

const RiskMapping: React.FC = () => {
  const { data: highRiskOccupations, isLoading: isLoadingRisk } = useQuery({
    queryKey: ['highRiskOccupations'],
    queryFn: () => supabaseService.getHighRiskOccupations(),
  });

  const { data: riskDistribution, isLoading: isLoadingDist } = useQuery({
    queryKey: ['riskDistribution'],
    queryFn: () => supabaseService.getRiskDistribution(),
  });

  const columns = [
    { key: 'title', label: 'Job Title' },
    { key: 'automationRisk', label: 'Automation Risk', 
      format: (value: number) => (
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${value >= 0.7 ? 'bg-red-500' : value >= 0.3 ? 'bg-yellow-500' : 'bg-green-500'}`} 
              style={{ width: `${value * 100}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm">{(value * 100).toFixed(0)}%</span>
        </div>
      )
    },
    { key: 'departmentCount', label: 'Employee Count' },
    { key: 'skillCategory', label: 'Skill Category' },
  ];

  if (isLoadingRisk || isLoadingDist) {
    return <div className="animate-pulse p-8">Loading risk data...</div>;
  }

  const riskChartData = [
    { name: 'High Risk', value: riskDistribution?.highRisk || 0 },
    { name: 'Medium Risk', value: riskDistribution?.mediumRisk || 0 },
    { name: 'Low Risk', value: riskDistribution?.lowRisk || 0 },
  ];

  const departmentData = highRiskOccupations?.map(o => ({
    name: o.title,
    value: o.departmentCount,
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-6">Automation Risk Mapping</h2>
        <p className="text-gray-600 mb-6">
          Identifying roles most susceptible to automation across departments to inform strategic workforce planning.
        </p>
      </div>

      <div className="dashboard-stats-grid">
        <StatCard 
          title="High Risk Roles" 
          value={riskDistribution?.highRisk || 0}
          color="red"
          icon="chart"
        />
        <StatCard 
          title="Medium Risk Roles" 
          value={riskDistribution?.mediumRisk || 0}
          color="yellow"
          icon="chart"
        />
        <StatCard 
          title="Low Risk Roles" 
          value={riskDistribution?.lowRisk || 0}
          color="green"
          icon="chart"
        />
        <StatCard 
          title="Employees in High Risk Roles" 
          value={highRiskOccupations?.reduce((sum, o) => sum + o.departmentCount, 0) || 0}
          type="increase"
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard 
          title="Risk Distribution by Role Count" 
          subtitle="Number of roles in each risk category"
          type="pie"
          data={riskChartData}
          colors={['#ef4444', '#f59e0b', '#10b981']}
        />
        
        <ChartCard 
          title="Employee Count in High Risk Roles" 
          subtitle="Number of employees in each high risk role"
          type="bar"
          data={departmentData}
          colors={['#3b82f6']}
        />
      </div>

      <DataTable 
        title="Top 10 Roles at Highest Risk of Automation" 
        data={highRiskOccupations || []}
        columns={columns}
      />
    </div>
  );
};

export default RiskMapping;
