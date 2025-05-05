
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

  // Process the nodes and edges to ensure they have proper string values
  const processNodes = (nodes: any[]) => {
    return nodes.map(node => ({
      ...node,
      id: String(node.id),
      label: typeof node.label === 'string' ? node.label : String(node.id),
      type: typeof node.type === 'string' ? node.type : 'Entity'
    }));
  };

  const processEdges = (edges: any[]) => {
    return edges.map(edge => ({
      ...edge,
      source: String(edge.source),
      target: String(edge.target),
      relationship: typeof edge.relationship === 'string' ? edge.relationship : 'related_to'
    }));
  };

  const chartData = results.result.chart.data;
  const nodes = chartData.nodes ? processNodes(chartData.nodes) : [];
  const edges = chartData.edges ? processEdges(chartData.edges) : [];
  
  console.log("Processed graph data:", { nodes, edges });

  return (
    <div className="space-y-6">
      <KnowledgeGraph 
        title={results.result.chart.type === 'knowledge_graph' ? 'Knowledge Graph' : 'Causal Graph'}
        nodes={nodes}
        edges={edges}
        height={550}
      />
    </div>
  );
};

export default GraphSection;
