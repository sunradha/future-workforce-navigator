
import React, { useRef } from 'react';
import { Network } from 'lucide-react';
import { KnowledgeGraphProps } from '../types/knowledgeGraphTypes';
import { 
  processSchemaNodes,
  processSchemaEdges,
  filterValidEdges,
  createCompleteNodeSet
} from '../utils/knowledgeGraphUtils';
import { useD3Graph } from '../hooks/useD3Graph';

const KnowledgeGraph = ({ title, nodes, edges, height = 450, isSchema = false }: KnowledgeGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Process nodes and edges if they are in string format
  const processedNodes = isSchema 
    ? processSchemaNodes(nodes as string[])
    : nodes;

  const processedEdges = isSchema 
    ? processSchemaEdges(edges as string[])
    : edges;

  // Filter out invalid edges
  const validEdges = filterValidEdges(processedEdges);
  
  // Create complete node set including nodes from edges
  const completeNodeSet = createCompleteNodeSet(processedNodes, validEdges);

  // Use D3 graph hook for rendering
  useD3Graph({
    svgRef,
    nodes: completeNodeSet,
    edges: validEdges,
    height,
  });

  return (
    <div className="w-full h-full p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
      <h3 className="text-base font-medium mb-3 flex items-center gap-2 text-purple-600">
        <Network className="h-5 w-5" />
        {title}
      </h3>
      <div className="w-full overflow-hidden rounded-md bg-white" style={{ height: `${height}px` }}>
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
