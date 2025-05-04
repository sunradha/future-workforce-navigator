
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
    <div className="space-y-1">
      <div className="space-y-1">
        <AnalysisCard 
          title="Reasoning Type"
          content={results.result.reasoning_justification}
          inline={true}
        />
        
        <AnalysisCard 
          title="Reasoning Path"
          content={results.result.reasoning_path || results.result.intent_justification}
          inline={true}
        />

        <AnalysisCard 
          title="AI Answer"
          content={results.result.reasoning_answer}
          inline={true}
        />
      </div>

      {results.result.graph && (
        <ProcessGraph graphData={results.result.graph} />
      )}
      
      {results.result.chart && (
        <div className="mt-1">
          <AnalysisCard 
            title="Chart"
            content={`Chart of type: ${results.result.chart.type || 'Unknown'}`}
          />
          {/* The chart rendering will be expanded in future updates */}
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
