
import React, { useRef, useState, useEffect } from 'react';
import { Network, Loader2 } from 'lucide-react';
import { useD3Graph } from '../hooks/useD3Graph';

interface ProcessGraphProps {
  graphData: string;
  title?: string;
}

// Define color palette for different process node types
const NODE_COLORS = {
  'start': '#10b981',         // Green for starting nodes
  'training': '#8B5CF6',      // Purple for training nodes
  'skill': '#3b82f6',         // Blue for skill nodes
  'certification': '#f59e0b', // Yellow for certification nodes
  'outcome': '#ef4444',       // Red for outcome nodes
  'process': '#6366f1',       // Indigo for general process nodes
  'transition': '#ec4899',    // Pink for transition nodes
  'default': '#8B5CF6'        // Default purple
};

const ProcessGraph = ({ graphData, title }: ProcessGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processedNodes, setProcessedNodes] = useState<any[]>([]);
  const [processedEdges, setProcessedEdges] = useState<any[]>([]);
  
  // Process the input data
  useEffect(() => {
    setIsLoading(true);
    
    try {
      const parsedData = JSON.parse(graphData);
      const nodes = parsedData.nodes || [];
      const edges = parsedData.edges || [];
      
      // Process nodes to ensure they have required properties and assign color types
      const preparedNodes = nodes.map(node => {
        // Determine node type from data or infer from label if possible
        let nodeType = (node.type || '').toLowerCase();
        
        // If no type is specified, try to infer from the node label
        if (!nodeType && node.label) {
          const label = node.label.toLowerCase();
          if (label.includes('start') || label.includes('begin')) {
            nodeType = 'start';
          } else if (label.includes('training') || label.includes('course') || label.includes('learning')) {
            nodeType = 'training';
          } else if (label.includes('skill') || label.includes('competency')) {
            nodeType = 'skill';
          } else if (label.includes('certification') || label.includes('certificate')) {
            nodeType = 'certification';
          } else if (label.includes('outcome') || label.includes('result')) {
            nodeType = 'outcome';
          } else if (label.includes('transition') || label.includes('move')) {
            nodeType = 'transition';
          } else {
            nodeType = 'process';
          }
        }
        
        return {
          ...node,
          id: String(node.id),
          label: node.label || String(node.id),
          type: nodeType || 'process'
        };
      });
      
      // Process edges to ensure they have required properties
      const preparedEdges = edges.map(edge => ({
        ...edge,
        source: String(edge.source),
        target: String(edge.target),
        relationship: edge.relationship || ''
      }));
      
      setProcessedNodes(preparedNodes);
      setProcessedEdges(preparedEdges);
      
      // Short delay for better user experience
      setTimeout(() => setIsLoading(false), 300);
    } catch (error) {
      console.error("Error processing graph data:", error);
      setIsLoading(false);
      setProcessedNodes([]);
      setProcessedEdges([]);
    }
  }, [graphData]);
  
  // Use the D3 graph hook
  useD3Graph({
    svgRef,
    nodes: processedNodes,
    edges: processedEdges,
    height: 500,
    darkMode: true, // Enable dark mode
    colorScale: NODE_COLORS  // Pass our custom color scale
  });
  
  return (
    <div className="w-full h-full p-5 bg-gray-900 rounded-lg border border-gray-800 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium flex items-center gap-2 text-green-400">
          <Network className="h-5 w-5" />
          {title || "Process Flow"}
        </h3>
        <span className="text-xs text-gray-400">
          {processedNodes.length} nodes • {processedEdges.length} connections
        </span>
      </div>
      
      <div className="w-full overflow-hidden rounded-md bg-gray-800" style={{ height: "500px" }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-green-400" />
            <span className="ml-2 text-sm text-gray-300">Initializing graph...</span>
          </div>
        ) : (
          processedNodes.length > 0 ? (
            <svg 
              ref={svgRef} 
              className="w-full h-full" 
              style={{ minHeight: "500px", background: "#1A1F2C" }}
              data-testid="process-graph-svg"
            ></svg>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-sm text-gray-400">No graph data available</span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProcessGraph;
