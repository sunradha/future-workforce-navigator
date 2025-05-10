
import { Node, Edge } from '../../types/knowledgeGraphTypes';

export const useValidationUtils = () => {
  const validateEdges = (edges: Edge[], nodes: Node[]): Edge[] => {
    // If there are no edges, return empty array
    if (!edges || !edges.length) {
      console.warn("No edges provided for validation");
      return [];
    }
    
    // Create a map for faster node lookup
    const nodeMap = new Map(nodes.map(node => [String(node.id), node]));
    
    console.log(`Validating ${edges.length} edges against ${nodes.length} nodes`);
    console.log("Node IDs:", Array.from(nodeMap.keys()));
    
    // Validate edges to ensure they connect to existing nodes
    const validEdges = edges.filter(edge => {
      const sourceId = String(edge.source);
      const targetId = String(edge.target);
      
      const hasSource = nodeMap.has(sourceId);
      const hasTarget = nodeMap.has(targetId);
      
      if (!hasSource) {
        console.warn(`Edge source not found: "${sourceId}"`);
      }
      
      if (!hasTarget) {
        console.warn(`Edge target not found: "${targetId}"`);
      }
      
      return hasSource && hasTarget;
    });
    
    console.log(`Found ${validEdges.length} valid edges out of ${edges.length}`);
    
    if (validEdges.length === 0 && edges.length > 0) {
      console.error("No valid edges found - all edges reference non-existent nodes");
      console.error("Edge sources/targets:", edges.map(e => `"${e.source}" -> "${e.target}"`));
    }
    
    return validEdges;
  };

  return { validateEdges };
};
