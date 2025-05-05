
import React from 'react';
import { ProcessMiningResponse } from '@/services/ProcessMiningService';
import AnalysisCard from './AnalysisCard';
import ProcessGraph from './ProcessGraph';
import ChartCard from '@/components/ChartCard';
import { Route } from 'lucide-react';
import KnowledgeGraph from './KnowledgeGraph';

interface AnalysisResultsProps {
  results: ProcessMiningResponse;
  visible: boolean;
}

const AnalysisResults = ({ results, visible }: AnalysisResultsProps) => {
  if (!results?.result || !visible) return null;
  
  // Check if there's chart data to display
  const hasStandardChartData = results.result.chart && 
    results.result.chart.data &&
    !['knowledge_graph', 'causal_graph'].includes(results.result.chart.type || '');
  
  // Check if there's knowledge graph data
  const hasKnowledgeGraph = results.result.chart && 
    ['knowledge_graph', 'causal_graph'].includes(results.result.chart.type || '') && 
    results.result.chart.data;

  console.log("Chart type:", results.result.chart?.type);
  console.log("Knowledge graph data:", hasKnowledgeGraph, results.result.chart?.data);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm">
        <AnalysisCard 
          title="Reasoning Type"
          content={results.result.reasoning_justification || results.result.reasoning_type}
          inline={true}
          type="reasoning"
        />
        
        <AnalysisCard 
          title="Reasoning Path"
          content={results.result.reasoning_path || (results.result.intent_justification || '')}
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

      {/* Standard charts (bar, pie) */}
      {!hasKnowledgeGraph && (
        <div className="grid gap-3 grid-cols-1">
          {results.result.graph && (
            <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm w-full">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Route className="h-4 w-4 text-blue-500" />
                Process Graph
              </h3>
              <ProcessGraph graphData={results.result.graph} />
            </div>
          )}
          
          {hasStandardChartData && (
            <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm w-full">
              <ChartCard
                title="Analysis Chart"
                subtitle="Visualized insights"
                type={results.result.chart.type === 'pie' ? 'pie' : 'bar'}
                data={results.result.chart.data}
                height={350}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}

      {/* Knowledge Graph or Causal Graph Visualization */}
      {hasKnowledgeGraph && (
        <div className="space-y-6">
          {/* Single graph visualization */}
          <KnowledgeGraph 
            title={results.result.chart.type === 'knowledge_graph' ? 'Knowledge Graph' : 'Causal Graph'}
            nodes={results.result.chart.data.nodes}
            edges={results.result.chart.data.edges}
            height={550}
          />
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
