
import React from 'react';
import { ProcessMiningResponse } from '@/services/ProcessMiningService';
import KnowledgeGraph from '../KnowledgeGraph';

interface GraphSectionProps {
  results: ProcessMiningResponse;
}

const GraphSection: React.FC<GraphSectionProps> = ({ results }) => {
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
      <KnowledgeGraph 
        title={results.result.chart.type === 'knowledge_graph' ? 'Knowledge Graph' : 'Causal Graph'}
        nodes={nodes}
        edges={edges}
        height={600}
      />
    </div>
  );
};

export default GraphSection;
