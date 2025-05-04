
import React from 'react';
import { ProcessMiningResponse } from '@/services/ProcessMiningService';
import AnalysisCard from './AnalysisCard';
import ProcessGraph from './ProcessGraph';

interface AnalysisResultsProps {
  results: ProcessMiningResponse;
  visible: boolean;
}

const AnalysisResults = ({ results, visible }: AnalysisResultsProps) => {
  if (!results?.result || !visible) return null;

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <AnalysisCard 
          title="Reasoning Type"
          content={results.result.reasoning_justification}
        />
        <AnalysisCard 
          title="Intent Justification"
          content={results.result.intent_justification}
        />
      </div>

      <AnalysisCard 
        title="Analysis Result"
        content={results.result.reasoning_answer}
      />

      {results.result.graph && (
        <ProcessGraph graphData={results.result.graph} />
      )}
    </div>
  );
};

export default AnalysisResults;
