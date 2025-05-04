
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
  const hasChartData = results.result.chart && results.result.chart.data;
  const hasKnowledgeGraph = results.result.chart && 
    (results.result.chart.type === 'knowledge_graph') && 
    results.result.chart.schema_kg && 
    results.result.chart.data_kg;

  console.log("Knowledge graph data:", hasKnowledgeGraph, results.result.chart?.schema_kg, results.result.chart?.data_kg);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm">
        <AnalysisCard 
          title="Reasoning Type"
          content={results.result.reasoning_justification}
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

      {/* Standard charts */}
      {!hasKnowledgeGraph && (
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

      {/* Knowledge Graph Visualization - Stacked vertically */}
      {hasKnowledgeGraph && (
        <div className="space-y-6">
          {/* Schema Knowledge Graph */}
          {results.result.chart.schema_kg && (
            <KnowledgeGraph 
              title="Conceptual Schema KG"
              nodes={results.result.chart.schema_kg.nodes}
              edges={results.result.chart.schema_kg.edges}
              isSchema={true}
              height={450}
            />
          )}
          
          {/* Data Knowledge Graph */}
          {results.result.chart.data_kg && (
            <KnowledgeGraph 
              title="Actual Data KG"
              nodes={results.result.chart.data_kg.nodes}
              edges={results.result.chart.data_kg.edges}
              height={550}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
