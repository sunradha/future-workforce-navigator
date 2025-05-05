
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
    linkDistance = 150,
    chargeStrength = -500,
    collideRadius = 80,
  } = options;

  // Create the graph simulation with improved parameters for causal graphs
  const simulation = d3.forceSimulation(nodes as any)
    .force("link", d3.forceLink(validEdges)
      .id((d: any) => d.id)
      .distance(linkDistance)
      .strength(1)
    )
    .force("charge", d3.forceManyBody().strength(chargeStrength))
    .force("collide", d3.forceCollide().radius(collideRadius).strength(1))
    .force("center", d3.forceCenter(centerX, centerY));

  // Set high alpha for better initial layout
  simulation.alpha(1);

  return simulation;
};
