
import React from 'react';
import { ProcessMiningResponse } from '@/services/ProcessMiningService';
import AnalysisCard from './AnalysisCard';
import ProcessGraph from './ProcessGraph';

interface AnalysisResultsProps {
  results: ProcessMiningResponse;
}

const AnalysisResults = ({ results }: AnalysisResultsProps) => {
  if (!results?.result) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <AnalysisCard 
            title="Reasoning Type"
            content={results.result.reasoning_type}
          />
          <AnalysisCard 
            title="Reasoning Justification"
            content={results.result.reasoning_justification}
          />
        </div>

        <div className="space-y-2">
          <AnalysisCard 
            title="Intent"
            content={results.result.intent}
          />
          <AnalysisCard 
            title="Intent Justification"
            content={results.result.intent_justification}
          />
        </div>
      </div>

      <AnalysisCard 
        title="Analysis Result"
        content={results.result.reasoning_answer}
      />

      {results.result.graph && (
        <ProcessGraph graphData={results.result.graph} />
      )}
    </>
  );
};

export default AnalysisResults;
