
import { Node, Edge } from '../types/knowledgeGraphTypes';

/**
 * Process schema nodes from string format to Node objects
 */
export const processSchemaNodes = (nodes: string[]): Node[] => {
  return nodes.map(node => {
    if (!node || typeof node !== 'string') {
      return { id: `unknown-${Math.random().toString(36).substr(2, 9)}`, label: 'Unknown Node', type: 'Unknown' };
    }
    
    // Split by colon and remove any quotes
    try {
      const parts = node.split(': ');
      const id = parts[0]?.replace(/['"]+/g, '').trim() || 'unknown';
      const type = parts[1]?.replace(/['"]+/g, '').trim() || 'Unknown';
      return { id, label: id, type };
    } catch (error) {
      console.error("Error processing schema node:", node, error);
      return { id: `error-${Math.random().toString(36).substr(2, 9)}`, label: node.toString(), type: 'Error' };
    }
  });
};

/**
 * Process schema edges from string format to Edge objects
 */
export const processSchemaEdges = (edges: string[]): Edge[] => {
  return edges.map(edge => {
    if (!edge || typeof edge !== 'string') {
      return { source: '', target: '', relationship: '' };
    }
    
    try {
      const parsed = edge.match(/source: (.*), target: (.*), relationship: (.*)/);
      if (!parsed) {
        console.warn("Could not parse edge:", edge);
        return { source: '', target: '', relationship: '' };
      }
      
      // Remove any quotes from parsed values
      return {
        source: parsed[1]?.replace(/['"]+/g, '').trim() || '',
        target: parsed[2]?.replace(/['"]+/g, '').trim() || '',
        relationship: parsed[3]?.replace(/['"]+/g, '').trim() || ''
      };
    } catch (error) {
      console.error("Error processing schema edge:", edge, error);
      return { source: '', target: '', relationship: '' };
    }
  });
};

/**
 * Filter out edges with empty or null source/target
 */
export const filterValidEdges = (edges: Edge[]): Edge[] => {
  return edges.filter(edge => 
    edge && 
    typeof edge === 'object' &&
    edge.source && edge.target && 
    edge.source !== null && edge.target !== null
  );
};

/**
 * Create a complete set of nodes including those referenced in edges
 */
export const createCompleteNodeSet = (nodes: Node[], edges: Edge[]): Node[] => {
  try {
    const nodesMap = new Map<string, Node>();
    
    // Add all existing nodes
    nodes.forEach(node => {
      if (node && node.id) {
        // Make sure the node has a valid label
        const label = typeof node.label === 'string' ? 
          node.label : 
          (typeof node.id === 'string' ? node.id : String(node.id));
        
        nodesMap.set(String(node.id), {
          ...node,
          id: String(node.id),
          label: label || String(node.id)
        });
      }
    });
    
    // Add missing nodes from edges
    edges.forEach(edge => {
      if (edge.source && !nodesMap.has(String(edge.source))) {
        nodesMap.set(String(edge.source), {
          id: String(edge.source),
          label: String(edge.source),
          type: "Entity"
        });
      }
      
      if (edge.target && !nodesMap.has(String(edge.target))) {
        nodesMap.set(String(edge.target), {
          id: String(edge.target),
          label: String(edge.target),
          type: "Entity"
        });
      }
    });
    
    return Array.from(nodesMap.values());
  } catch (error) {
    console.error("Error creating complete node set:", error);
    return nodes;
  }
};

/**
 * Verify that edges connect to existing nodes
 */
export const validateEdges = (edges: Edge[], nodes: Node[]): Edge[] => {
  if (!edges || !Array.isArray(edges) || !nodes || !Array.isArray(nodes)) {
    console.error("Invalid edges or nodes:", { edges, nodes });
    return [];
  }
  
  // Create a set of node IDs for fast lookup
  const nodeIds = new Set(nodes.map(node => String(node.id)));
  
  // Filter edges to only include those with source and target in our nodes
  const validEdges = edges.filter(edge => {
    const sourceId = String(edge.source);
    const targetId = String(edge.target);
    
    if (!nodeIds.has(sourceId) || !nodeIds.has(targetId)) {
      console.warn(`Edge with invalid node references: ${sourceId} -> ${targetId}`);
      return false;
    }
    
    return true;
  });
  
  return validEdges;
};
