
import * as d3 from 'd3';
import { Node } from '../../types/knowledgeGraphTypes';

// Interface for drag event subject with fixed position attributes
interface DragSubject extends d3.SimulationNodeDatum {
  x: number;
  y: number;
  fx: number | null;
  fy: number | null;
}

export const useNodeRenderer = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  nodes: Node[],
  simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>,
  cleanTextFn: (text: any) => string
) => {
  // Color scale for node types
  const color = d3.scaleOrdinal<string>()
    .domain(["outcome", "factor", "intervention", "entity", "Entity"])
    .range(["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8B5CF6"]);

  // Create node groups
  const nodeGroup = g.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .call(d3.drag<SVGGElement, Node>()
      .on("start", (event) => dragstarted(event, simulation))
      .on("drag", (event) => dragged(event))
      .on("end", (event) => dragended(event, simulation)));

  // Add node circles
  const node = nodeGroup.append("circle")
    .attr("r", 25) // Increased radius for better visibility
    .attr("fill", (d: any): string => {
      // Get color based on node type, with proper type casting
      const nodeType = d.type ? cleanTextFn(d.type).toLowerCase() : "entity";
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
    .attr("dy", 0) // Center text in the node
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle") // Vertically center text
    .attr("fill", "#fff") // White text for better visibility
    .each(function(d: any) {
      // Wrap long text labels
      const text = d3.select(this);
      const words = cleanTextFn(d.label).split(/\s+/);
      const lineHeight = 1.1; // ems
      
      // Clear initial text
      text.text(null);
      
      if (words.length === 1) {
        // For single words, just set the text
        text.append("tspan")
          .attr("x", 0)
          .attr("y", 0)
          .text(words[0]);
      } else {
        // For multiple words, wrap on two lines
        const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(" ");
        const secondLine = words.slice(Math.ceil(words.length / 2)).join(" ");
        
        text.append("tspan")
          .attr("x", 0)
          .attr("y", -6)
          .text(firstLine);
        
        text.append("tspan")
          .attr("x", 0)
          .attr("y", 6)
          .text(secondLine);
      }
    });

  // Add tooltips for nodes
  node.append("title")
    .text((d: any) => `${cleanTextFn(d.label)} (${cleanTextFn(d.type) || "Entity"})`);

  return { nodeGroup, node, nodeLabels };
};

// Drag functions with proper TypeScript types
export const dragstarted = (
  event: d3.D3DragEvent<SVGGElement, Node, DragSubject>,
  simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>
) => {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
};

export const dragged = (
  event: d3.D3DragEvent<SVGGElement, Node, DragSubject>
) => {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
};

export const dragended = (
  event: d3.D3DragEvent<SVGGElement, Node, DragSubject>,
  simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>
) => {
  if (!event.active) simulation.alphaTarget(0);
  // Fixed positions are maintained to make the graph more stable
  // Uncomment the lines below if you want nodes to return to free-floating state
  // event.subject.fx = null;
  // event.subject.fy = null;
};
