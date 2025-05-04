
import React from 'react';
import { ProcessMiningResponse } from '@/services/ProcessMiningService';
import AnalysisCard from './AnalysisCard';
import ProcessGraph from './ProcessGraph';
import ChartCard from '@/components/ChartCard';

interface AnalysisResultsProps {
  results: ProcessMiningResponse;
  visible: boolean;
}

const AnalysisResults = ({ results, visible }: AnalysisResultsProps) => {
  if (!results?.result || !visible) return null;
  
  // Check if there's chart data to display
  const hasChartData = results.result.chart && results.result.chart.data;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-3 bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
        <AnalysisCard 
          title="Reasoning Type:"
          content={results.result.reasoning_justification}
          inline={true}
          type="reasoning"
        />
        
        <AnalysisCard 
          title="Reasoning Path:"
          content={results.result.reasoning_path || results.result.intent_justification}
          inline={true}
          type="path"
        />

        <AnalysisCard 
          title="AI Answer:"
          content={results.result.reasoning_answer}
          inline={true}
          type="answer"
        />
      </div>

      {results.result.graph && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Route className="h-5 w-5 text-blue-500" />
            Process Graph
          </h3>
          <ProcessGraph graphData={results.result.graph} />
        </div>
      )}
      
      {hasChartData ? (
        <div className="mt-4">
          <ChartCard
            title={`Analysis Chart: ${results.result.chart.type || 'Data Visualization'}`}
            subtitle="Visualized insights from the analysis"
            type={results.result.chart.type === 'pie' ? 'pie' : 'bar'}
            data={results.result.chart.data}
            height={350}
          />
        </div>
      ) : results.result.chart ? (
        <div className="mt-4">
          <AnalysisCard 
            title="Chart Info"
            content={`Chart type: ${results.result.chart.type || 'Unknown'}`}
            type="chart"
          />
        </div>
      ) : null}
    </div>
  );
};

export default AnalysisResults;
