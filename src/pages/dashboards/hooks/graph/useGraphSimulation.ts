
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
    linkDistance = 250,           // Increased for better spacing between nodes
    chargeStrength = -1000,       // Stronger repulsion to avoid overlap
    collideRadius = 120,          // Larger collision radius to prevent overlapping
  } = options;

  // Prepare nodes and links for d3 simulation
  const simulationNodes = nodes.map(node => ({...node}));
  const simulationLinks = validEdges.map(edge => ({...edge}));

  // Create the graph simulation with improved parameters for knowledge graphs
  const simulation = d3.forceSimulation(simulationNodes as any)
    .force("link", d3.forceLink(simulationLinks)
      .id((d: any) => d.id)
      .distance(linkDistance)
      .strength(0.6)  // Reduced from 0.7 for more flexibility
    )
    .force("charge", d3.forceManyBody().strength(chargeStrength))
    .force("collide", d3.forceCollide().radius(collideRadius).strength(0.9))
    .force("center", d3.forceCenter(centerX, centerY))
    // Add x and y forces to spread nodes more evenly
    .force("x", d3.forceX(centerX).strength(0.08))
    .force("y", d3.forceY(centerY).strength(0.08));

  // Set high alpha for better initial layout
  simulation.alpha(1);
  
  // Run more initial iterations for better positioning
  for (let i = 0; i < 200; i++) {
    simulation.tick();
  }

  return simulation;
};
