
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
    }, 500);
    
    return () => clearTimeout(timer);
  }, [results]);
  
  if (!results?.result) return null;
  
  // Check if there's knowledge graph data to display
  const hasKnowledgeGraph = results.result.chart && 
    ['knowledge_graph', 'causal_graph'].includes(results.result.chart.type || '') && 
    results.result.chart.data;
  
  if (!hasKnowledgeGraph) return null;

  const chartData = results.result.chart.data;
  const nodes = chartData?.nodes || [];
  const edges = chartData?.edges || [];
  
  // Only render if we actually have data
  if (nodes.length === 0) return null;
  
  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="bg-gray-100 rounded-lg flex items-center justify-center p-8" style={{ height: "600px" }}>
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-700">Initializing graph...</span>
        </div>
      ) : (
        <KnowledgeGraph 
          title={results.result.chart.type === 'knowledge_graph' ? 'Knowledge Graph' : 'Causal Graph'}
          nodes={nodes}
          edges={edges}
          height={600}
        />
      )}
    </div>
  );
};

export default GraphSection;
