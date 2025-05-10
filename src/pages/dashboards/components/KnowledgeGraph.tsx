
import React, { useRef, useState, useEffect } from 'react';
import { Network, Loader2 } from 'lucide-react';
import { KnowledgeGraphProps, Node, Edge } from '../types/knowledgeGraphTypes';
import { 
  processSchemaNodes,
  processSchemaEdges,
  filterValidEdges,
  createCompleteNodeSet
} from '../utils/knowledgeGraphUtils';
import { useD3Graph } from '../hooks/useD3Graph';

const KnowledgeGraph = ({ title, nodes, edges, height = 550, isSchema = false }: KnowledgeGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);

  // Process nodes and edges if they are in string format
  const processedNodes = isSchema 
    ? processSchemaNodes(nodes as string[])
    : (nodes as Node[]);

  const processedEdges = isSchema 
    ? processSchemaEdges(edges as string[])
    : (edges as Edge[]);

  // Filter out invalid edges
  const validEdges = filterValidEdges(processedEdges);
  
  // Create complete node set including nodes from edges
  const completeNodeSet = createCompleteNodeSet(processedNodes, validEdges);

  // Track data metrics for user feedback
  useEffect(() => {
    setNodeCount(completeNodeSet.length);
    setEdgeCount(validEdges.length);
    
    // Apply a short loading state to ensure DOM is ready for D3
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [completeNodeSet.length, validEdges.length]);

  // Use D3 graph hook for rendering
  useD3Graph({
    svgRef,
    nodes: completeNodeSet,
    edges: validEdges,
    height,
  });

  return (
    <div className="w-full h-full p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium flex items-center gap-2 text-purple-600">
          <Network className="h-5 w-5" />
          {title}
        </h3>
        <span className="text-xs text-gray-500">
          {nodeCount} nodes • {edgeCount} connections
        </span>
      </div>
      
      <div className="w-full overflow-hidden rounded-md bg-gray-50" style={{ height: `${height}px` }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-sm text-gray-600">Initializing graph...</span>
          </div>
        ) : (
          <svg 
            ref={svgRef} 
            className="w-full h-full" 
            style={{ minHeight: `${height}px` }}
            data-testid="knowledge-graph-svg"
          ></svg>
        )}
      </div>
    </div>
  );
};

export default KnowledgeGraph;
