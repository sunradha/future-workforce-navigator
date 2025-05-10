
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
    if (!Array.isArray(nodes)) return [];
    
    return nodes.map(node => ({
      ...node,
      id: String(node.id),
      // Use consistent labels
      label: typeof node.label === 'string' ? node.label : String(node.id),
      // Normalize type field
      type: typeof node.type === 'string' ? node.type.toLowerCase() : 'entity'
    }));
  };

  const processEdges = (edges: any[]) => {
    if (!Array.isArray(edges)) return [];
    
    return edges.map(edge => ({
      ...edge,
      source: String(edge.source),
      target: String(edge.target),
      relationship: typeof edge.relationship === 'string' ? edge.relationship : 'related_to'
    }));
  };

  const chartData = results.result.chart.data;
  
  // Ensure we're getting the nodes and edges data correctly
  const nodes = chartData && chartData.nodes ? processNodes(chartData.nodes) : [];
  const edges = chartData && chartData.edges ? processEdges(chartData.edges) : [];
  
  console.log("Knowledge graph data:", { 
    chartType: results.result.chart.type,
    nodes,
    edges,
    nodeIds: nodes.map(n => n.id),
    edgeSources: edges.map(e => e.source),
    edgeTargets: edges.map(e => e.target)
  });

  // Validate that edges reference existing nodes
  const nodeIds = new Set(nodes.map(n => n.id));
  const validEdges = edges.filter(edge => 
    nodeIds.has(edge.source) && nodeIds.has(edge.target)
  );
  
  console.log(`Filtered edges: ${validEdges.length} valid out of ${edges.length} total`);

  return (
    <div className="space-y-6">
      <KnowledgeGraph 
        title={results.result.chart.type === 'knowledge_graph' ? 'Knowledge Graph' : 'Causal Graph'}
        nodes={nodes}
        edges={validEdges}
        height={600} // Increased height for better visualization
      />
    </div>
  );
};

export default GraphSection;
