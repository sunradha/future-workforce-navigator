
import * as d3 from 'd3';
import { Node, Edge } from '../../types/knowledgeGraphTypes';
import { GraphSimulationOptions } from './types';

export const useGraphSimulation = (
  nodes: Node[],
  validEdges: Edge[],
  centerX: number,
  centerY: number,
  options: GraphSimulationOptions = {}
) => {
  const {
    linkDistance = 200,           // Increased for better spacing between nodes
    chargeStrength = -800,       // Stronger repulsion to avoid overlap
    collideRadius = 60,          // Larger collision radius for more spacing
  } = options;

  // Ensure all nodes have initial positions to improve layout consistency
  const simulationNodes = nodes.map((node, i) => {
    // Calculate initial positions in a circular layout
    const angle = (i / nodes.length) * 2 * Math.PI;
    const radius = Math.min(centerX, centerY) * 0.6;
    
    return {
      ...node,
      // Set initial positions in a circle around the center
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });
  
  const simulationLinks = validEdges.map(edge => ({...edge}));

  // Create the graph simulation with improved parameters for knowledge graphs
  const simulation = d3.forceSimulation(simulationNodes as any)
    .force("link", d3.forceLink(simulationLinks)
      .id((d: any) => d.id)
      .distance(linkDistance)
      .strength(0.5)  // Reduced for more flexibility
    )
    .force("charge", d3.forceManyBody().strength(chargeStrength))
    .force("collide", d3.forceCollide().radius(collideRadius).strength(1))
    .force("center", d3.forceCenter(centerX, centerY))
    // Add x and y forces to better distribute nodes
    .force("x", d3.forceX(centerX).strength(0.05))
    .force("y", d3.forceY(centerY).strength(0.05))
    // Add a radial force to encourage nodes to form a circle
    .force("radial", d3.forceRadial(Math.min(centerX, centerY) * 0.6, centerX, centerY).strength(0.3));

  // Set high alpha for better initial layout
  simulation.alpha(0.8);
  
  // Run more initial iterations for better positioning
  for (let i = 0; i < 300; i++) {
    simulation.tick();
  }

  return simulation;
};
