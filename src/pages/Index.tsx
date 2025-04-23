
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import RiskMapping from './dashboards/RiskMapping';
import TrainingAssessment from './dashboards/TrainingAssessment';
import PredictiveModeling from './dashboards/PredictiveModeling';
import BudgetAnalysis from './dashboards/BudgetAnalysis';
import RolePrioritization from './dashboards/RolePrioritization';
import ProcessMining from './dashboards/ProcessMining';
import { DashboardTab } from '@/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('risk');

  const renderDashboard = () => {
    switch (activeTab) {
      case 'risk':
        return <RiskMapping />;
      case 'effectiveness':
        return <TrainingAssessment />;
      case 'prediction':
        return <PredictiveModeling />;
      case 'budget':
        return <BudgetAnalysis />;
      case 'prioritization':
        return <RolePrioritization />;
      case 'process-mining':
        return <ProcessMining />;
      default:
        return <RiskMapping />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderDashboard()}
    </Layout>
  );
};

export default Index;

