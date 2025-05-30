
import React, { useEffect, useState } from 'react';
import { ProcessMiningResponse } from '@/services/ProcessMiningService';
import KnowledgeGraph from '../KnowledgeGraph';
import { Loader2 } from 'lucide-react';

interface GraphSectionProps {
  results: ProcessMiningResponse;
}

const GraphSection: React.FC<GraphSectionProps> = ({ results }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Short timeout to ensure DOM is ready for D3 rendering
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [results]);
  
  if (!results?.result) return null;
  
  // Check if there's knowledge graph or causal graph data to display
  // (process_flow is handled in StandardChartsSection)
  const hasGraphData = results.result.chart && 
    ['knowledge_graph', 'causal_graph'].includes(results.result.chart.type || '') && 
    results.result.chart.data;
  
  if (!hasGraphData) return null;

  const chartData = results.result.chart.data;
  const nodes = chartData?.nodes || [];
  const edges = chartData?.edges || [];
  
  // Only render if we actually have data
  if (nodes.length === 0) return null;
  
  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="bg-gray-800 rounded-lg flex items-center justify-center p-8" style={{ height: "600px" }}>
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <span className="ml-2 text-gray-200">Initializing graph...</span>
        </div>
      ) : (
        <KnowledgeGraph 
          title={results.result.chart.type === 'knowledge_graph' ? 'Knowledge Graph' : 'Causal Graph'}
          nodes={nodes}
          edges={edges}
          height={600}
          darkMode={true}
        />
      )}
    </div>
  );
};

export default GraphSection;
