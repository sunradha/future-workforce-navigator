import * as d3 from 'd3';
import { Node } from '../../types/knowledgeGraphTypes';

export const useNodeRenderer = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  nodes: Node[],
  simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>,
  cleanTextFn: (text: any) => string
) => {
  // Color scale for node types
  const color = d3.scaleOrdinal<string>()
    .domain(["outcome", "factor", "intervention", "Entity"])
    .range(["#ef4444", "#f59e0b", "#3b82f6", "#10b981"]);

  // Create node groups
  const nodeGroup = g.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .call(d3.drag()
      .on("start", (event) => dragstarted(event, simulation))
      .on("drag", (event) => dragged(event))
      .on("end", (event) => dragended(event, simulation)) as any);

  // Add node circles
  const node = nodeGroup.append("circle")
    .attr("r", 20)
    .attr("fill", (d: any): string => {
      // Get color based on node type, with proper type casting
      const nodeType = d.type ? cleanTextFn(d.type) : "Entity";
      return color(nodeType);
    })
    .attr("stroke", "#fff")
    .attr("stroke-width", 2);

  // Add node labels
  const nodeLabels = nodeGroup.append("text")
    .text((d: any) => cleanTextFn(d.label))
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .attr("dx", 0)
    .attr("dy", 30)
    .attr("text-anchor", "middle")
    .attr("fill", "#333");

  // Add tooltips for nodes
  node.append("title")
    .text((d: any) => `${cleanTextFn(d.label)} (${cleanTextFn(d.type) || "Unknown Type"})`);

  return { nodeGroup, node, nodeLabels };
};

// Drag functions
export const dragstarted = (
  event: d3.D3DragEvent<Element, unknown, unknown>,
  simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>
) => {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
};

export const dragged = (event: d3.D3DragEvent<Element, unknown, unknown>) => {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
};

export const dragended = (
  event: d3.D3DragEvent<Element, unknown, unknown>,
  simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>
) => {
  if (!event.active) simulation.alphaTarget(0);
  // Keep nodes in fixed positions after drag for causal graphs
  // This makes the graph more stable
  // event.subject.fx = null;
  // event.subject.fy = null;
};
