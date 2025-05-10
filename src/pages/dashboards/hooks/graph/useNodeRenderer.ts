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
  // Enhanced color scale for node types with better visibility
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

  // Add a white background circle for better text readability
  nodeGroup.append("circle")
    .attr("r", 30) // Larger radius for better text containment
    .attr("fill", "white")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2);
  
  // Add colored node circles
  const node = nodeGroup.append("circle")
    .attr("r", 28) // Slightly smaller than the background for a border effect
    .attr("fill", (d: any): string => {
      // Get color based on node type, with proper type casting
      const nodeType = d.type ? cleanTextFn(d.type).toLowerCase() : "entity";
      return color(nodeType);
    })
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.5)
    .attr("opacity", 0.85); // Slightly transparent for better text visibility

  // Add node labels with proper text wrapping
  const nodeLabels = nodeGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", "10px") // Smaller font for better fit
    .attr("font-weight", "bold")
    .attr("fill", "#fff") // White text for better visibility on colored nodes
    .attr("pointer-events", "none") // Allow clicks to pass through to the node
    .each(function(d: any) {
      // Get the text content
      const label = cleanTextFn(d.label);
      const words = label.split(/\s+/).filter(Boolean);
      
      // For very short labels (single word)
      if (words.length === 1 && label.length < 12) {
        d3.select(this).append("tspan")
          .attr("x", 0)
          .attr("y", 0)
          .text(label);
        return;
      }
      
      // For longer labels, wrap text
      // Calculate how many words per line based on length
      const wordsPerLine = words.length <= 3 ? Math.ceil(words.length / 2) : Math.ceil(words.length / 3);
      
      // Split into lines of roughly equal word counts
      const lines: string[] = [];
      for (let i = 0; i < words.length; i += wordsPerLine) {
        lines.push(words.slice(i, i + wordsPerLine).join(" "));
      }
      
      // If we have too many lines, limit to 2 or 3
      const displayLines = lines.slice(0, 3);
      if (lines.length > 3) {
        displayLines[2] = displayLines[2] + "...";
      }
      
      // Apply the lines to the text element with proper spacing
      displayLines.forEach((line, i) => {
        const lineHeight = 12; // pixels between lines
        const yPos = (i - (displayLines.length - 1) / 2) * lineHeight;
        
        d3.select(this).append("tspan")
          .attr("x", 0)
          .attr("y", yPos)
          .text(line);
      });
    });

  // Add tooltips for nodes with full label text
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
  // Keep positions fixed to improve graph stability
  // This prevents nodes from moving around after user interaction
};
