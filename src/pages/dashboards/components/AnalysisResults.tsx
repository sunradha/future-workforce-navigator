
import React from 'react';
import { ProcessMiningResponse } from '@/services/ProcessMiningService';
import AnalysisCard from './AnalysisCard';
import ProcessGraph from './ProcessGraph';
import ChartDisplay from './ChartDisplay';

interface AnalysisResultsProps {
  results: ProcessMiningResponse;
  visible: boolean;
}

const AnalysisResults = ({ results, visible }: AnalysisResultsProps) => {
  if (!results?.result || !visible) return null;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <AnalysisCard 
          title="Reasoning Type"
          content={results.result.reasoning_type}
          inline={true}
        />
        <AnalysisCard 
          title="Reasoning Path"
          content={results.result.reasoning_path}
          inline={true}
        />
      </div>

      <div className="space-y-2">
        <AnalysisCard 
          title="Reasoning Justification"
          content={results.result.reasoning_justification}
        />
        {results.result.intent_justification && (
          <AnalysisCard 
            title="Intent Justification"
            content={results.result.intent_justification}
          />
        )}
      </div>

      <AnalysisCard 
        title="Analysis Result"
        content={results.result.reasoning_answer || "No analysis result available"}
      />

      {results.result.chart && (
        <ChartDisplay chartData={results.result.chart} />
      )}

      {results.result.graph && (
        <ProcessGraph graphData={results.result.graph} />
      )}
    </div>
  );
};

export default AnalysisResults;
