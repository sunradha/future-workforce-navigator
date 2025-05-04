
import { Node, Edge } from '../types/knowledgeGraphTypes';

/**
 * Process schema nodes from string format to Node objects
 */
export const processSchemaNodes = (nodes: string[]): Node[] => {
  return nodes.map(node => {
    const [id, type] = node.split(': ');
    return { id, label: id, type };
  });
};

/**
 * Process schema edges from string format to Edge objects
 */
export const processSchemaEdges = (edges: string[]): Edge[] => {
  return edges.map(edge => {
    const parsed = edge.match(/source: (.*), target: (.*), relationship: (.*)/);
    if (!parsed) return { source: '', target: '', relationship: '' };
    return {
      source: parsed[1],
      target: parsed[2],
      relationship: parsed[3]
    };
  });
};

/**
 * Filter out edges with empty or null source/target
 */
export const filterValidEdges = (edges: Edge[]): Edge[] => {
  return edges.filter(edge => 
    edge.source && edge.target && 
    edge.source !== null && edge.target !== null
  );
};

/**
 * Create a complete set of nodes including those referenced in edges
 */
export const createCompleteNodeSet = (nodes: Node[], edges: Edge[]): Node[] => {
  const nodesMap = new Map<string, Node>();
  
  // Add all existing nodes
  nodes.forEach(node => {
    nodesMap.set(node.id, {...node});
  });
  
  // Add missing nodes from edges
  edges.forEach(edge => {
    if (!nodesMap.has(edge.source)) {
      nodesMap.set(edge.source, {
        id: edge.source,
        label: edge.source,
        type: "Training Program" // Assuming missing nodes are training programs
      });
    }
    
    if (!nodesMap.has(edge.target)) {
      nodesMap.set(edge.target, {
        id: edge.target,
        label: `Unknown (${edge.target})`,
        type: "Unknown"
      });
    }
  });
  
  return Array.from(nodesMap.values());
};
