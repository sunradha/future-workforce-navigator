
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
    linkDistance = 200,           // Increased link distance
    chargeStrength = -800,        // Stronger repulsion
    collideRadius = 70,           // Increased collision radius
  } = options;

  // Create copies of nodes and edges to avoid mutation
  const simulationNodes = nodes.map((node, i) => {
    // Better initial positions - spread nodes out more
    const angle = (i / nodes.length) * 2 * Math.PI;
    const radius = Math.min(centerX, centerY) * 0.6; // Wider spread
    
    return {
      ...node,
      // Set initial positions in a circle around the center
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });
  
  const simulationLinks = validEdges.map(edge => ({
    ...edge,
    // Ensure source and target are strings
    source: String(edge.source),
    target: String(edge.target)
  }));

  // Create force simulation with improved parameters
  const simulation = d3.forceSimulation(simulationNodes as any)
    .force("link", d3.forceLink(simulationLinks)
      .id((d: any) => String(d.id))
      .distance(linkDistance)
      .strength(0.5)  // Moderate link force
    )
    .force("charge", d3.forceManyBody()
      .strength(chargeStrength)
      .distanceMin(150)  // Increased minimum distance for force calculation
      .distanceMax(800)  // Increased maximum distance for force calculation
    )
    .force("collide", d3.forceCollide()
      .radius(collideRadius)
      .strength(1)  // Maximum collision strength to prevent overlap
      .iterations(3)  // More iterations for better collision detection
    )
    .force("center", d3.forceCenter(centerX, centerY).strength(0.2))
    // Add x and y forces for better distribution
    .force("x", d3.forceX(centerX).strength(0.1))
    .force("y", d3.forceY(centerY).strength(0.1))

  // Set alpha for better initial layout
  simulation.alpha(1.0).alphaDecay(0.01); // Slower decay for better stabilization
  
  // Run more initial iterations for better positioning
  for (let i = 0; i < 300; i++) {
    simulation.tick();
  }

  return simulation;
};
