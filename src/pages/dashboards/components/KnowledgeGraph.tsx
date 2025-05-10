
import React, { useRef, useState, useEffect } from 'react';
import { Network, Loader2 } from 'lucide-react';
import { KnowledgeGraphProps } from '../types/knowledgeGraphTypes';
import { useD3Graph } from '../hooks/useD3Graph';

const KnowledgeGraph = ({ 
  title, 
  nodes, 
  edges, 
  height = 550,
  isSchema = false 
}: KnowledgeGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processedNodes, setProcessedNodes] = useState<any[]>([]);
  const [processedEdges, setProcessedEdges] = useState<any[]>([]);

  // Process the input data
  useEffect(() => {
    setIsLoading(true);
    
    // Process nodes - ensure all nodes have required properties
    const preparedNodes = Array.isArray(nodes) ? nodes.map(node => {
      // Handle string inputs for schema mode
      if (typeof node === 'string') {
        const parts = node.split(': ');
        const id = parts[0]?.replace(/['"]+/g, '').trim() || 'unknown';
        const type = parts[1]?.replace(/['"]+/g, '').trim() || 'entity';
        return { id, label: id, type };
      }
      
      // Handle object inputs
      return {
        ...node,
        id: String(node.id),
        label: node.label || String(node.id),
        type: (node.type || 'entity').toLowerCase()
      };
    }) : [];
    
    // Process edges - ensure all edges have required properties
    const preparedEdges = Array.isArray(edges) ? edges.map(edge => {
      // Handle string inputs for schema mode
      if (typeof edge === 'string') {
        const match = edge.match(/source: (.*), target: (.*), relationship: (.*)/);
        if (match) {
          return {
            source: match[1]?.replace(/['"]+/g, '').trim() || '',
            target: match[2]?.replace(/['"]+/g, '').trim() || '',
            relationship: match[3]?.replace(/['"]+/g, '').trim() || ''
          };
        }
        return { source: '', target: '', relationship: '' };
      }
      
      // Handle object inputs
      return {
        ...edge,
        source: String(edge.source),
        target: String(edge.target),
        relationship: edge.relationship || ''
      };
    }) : [];
    
    // Filter out invalid edges
    const nodeIdSet = new Set(preparedNodes.map(n => n.id));
    const validEdges = preparedEdges.filter(edge => 
      nodeIdSet.has(edge.source) && 
      nodeIdSet.has(edge.target)
    );
    
    setProcessedNodes(preparedNodes);
    setProcessedEdges(validEdges);
    
    // Longer delay to ensure DOM is fully ready
    setTimeout(() => setIsLoading(false), 400);
  }, [nodes, edges, isSchema]);

  // Use the D3 graph hook
  useD3Graph({
    svgRef,
    nodes: processedNodes,
    edges: processedEdges,
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
          {processedNodes.length} nodes • {processedEdges.length} connections
        </span>
      </div>
      
      <div className="w-full overflow-hidden rounded-md bg-gray-900" style={{ height: `${height}px` }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-sm text-gray-100">Initializing graph...</span>
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
