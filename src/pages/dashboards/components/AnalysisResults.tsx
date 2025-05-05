
import React from 'react';
import { ProcessMiningResponse } from '@/services/ProcessMiningService';
import ReasoningSection from './analysis-results/ReasoningSection';
import StandardChartsSection from './analysis-results/StandardChartsSection';
import GraphSection from './analysis-results/GraphSection';

interface AnalysisResultsProps {
  results: ProcessMiningResponse;
  visible: boolean;
}

const AnalysisResults = ({ results, visible }: AnalysisResultsProps) => {
  if (!results?.result || !visible) return null;
  
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Reasoning Section */}
      <ReasoningSection results={results} />
      
      {/* Charts Section */}
      <StandardChartsSection results={results} />
      
      {/* Knowledge Graph or Causal Graph Visualization */}
      <GraphSection results={results} />
    </div>
  );
};

export default AnalysisResults;
