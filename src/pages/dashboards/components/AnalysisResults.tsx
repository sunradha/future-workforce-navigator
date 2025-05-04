
import React from 'react';
import { ProcessMiningResponse } from '@/services/ProcessMiningService';
import AnalysisCard from './AnalysisCard';
import ProcessGraph from './ProcessGraph';
import ChartCard from '@/components/ChartCard';
import { Route } from 'lucide-react';

interface AnalysisResultsProps {
  results: ProcessMiningResponse;
  visible: boolean;
}

const AnalysisResults = ({ results, visible }: AnalysisResultsProps) => {
  if (!results?.result || !visible) return null;
  
  // Check if there's chart data to display
  const hasChartData = results.result.chart && results.result.chart.data;

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm">
        <AnalysisCard 
          title="Reasoning Type"
          content={results.result.reasoning_justification}
          inline={true}
          type="reasoning"
        />
        
        <AnalysisCard 
          title="Reasoning Path"
          content={results.result.reasoning_path || results.result.intent_justification}
          inline={true}
          type="path"
        />

        <AnalysisCard 
          title="AI Answer"
          content={results.result.reasoning_answer}
          inline={true}
          type="answer"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {results.result.graph && (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Route className="h-4 w-4 text-blue-500" />
              Process Graph
            </h3>
            <ProcessGraph graphData={results.result.graph} />
          </div>
        )}
        
        {hasChartData && (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm">
            <ChartCard
              title={`Analysis Chart: ${results.result.chart.type || 'Data Visualization'}`}
              subtitle="Visualized insights"
              type={results.result.chart.type === 'pie' ? 'pie' : 'bar'}
              data={results.result.chart.data}
              height={300}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
