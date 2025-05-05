
import { Node, Edge } from '../../types/knowledgeGraphTypes';

export const useValidationUtils = () => {
  const validateEdges = (edges: Edge[], nodes: Node[]): Edge[] => {
    // Create a map for faster node lookup
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    
    // Validate edges to ensure they connect to existing nodes
    const validEdges = edges.filter(edge => 
      nodeMap.has(edge.source) && nodeMap.has(edge.target)
    );
    
    if (validEdges.length === 0) {
      console.error("No valid edges found - all edges reference non-existent nodes");
      console.error("Node IDs:", Array.from(nodeMap.keys()));
      console.error("Edge sources/targets:", edges.map(e => `${e.source} -> ${e.target}`));
    }
    
    return validEdges;
  };

  return { validateEdges };
};
