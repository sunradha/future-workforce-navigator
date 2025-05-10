
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
  // Enhanced color scale with better contrasting colors
  const color = d3.scaleOrdinal<string>()
    .domain(["outcome", "factor", "intervention", "entity", "training", "employee", "occupation", "industry", "reskilling_case", "reskilling_event"])
    .range(["#ef4444", "#f59e0b", "#3b82f6", "#8B5CF6", "#10b981", "#06b6d4", "#eab308", "#ec4899", "#a855f7", "#f43f5e"]);

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
    .attr("r", 45) // Larger radius for better visibility
    .attr("fill", "white")
    .attr("stroke", "#f3f4f6")
    .attr("stroke-width", 3);
  
  // Add colored node circles
  const node = nodeGroup.append("circle")
    .attr("r", 40) // Slightly smaller than the background
    .attr("fill", (d: any): string => {
      // Get color based on node type with proper fallback
      const nodeType = d.type ? cleanTextFn(d.type).toLowerCase() : "entity";
      return color(nodeType);
    })
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .attr("opacity", 1); 

  // Add node labels with improved text wrapping
  const nodeLabels = nodeGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .attr("fill", "#fff")
    .attr("pointer-events", "none")
    .each(function(d: any) {
      // Process the label text
      const label = cleanTextFn(d.label);
      
      // Split label into words
      const words = label.split(/\s+/).filter(Boolean);
      
      // For short text, don't wrap
      if (words.length <= 2 && label.length < 15) {
        d3.select(this).append("tspan")
          .attr("x", 0)
          .attr("y", 0)
          .text(label);
        return;
      }
      
      // For longer text, wrap into lines
      const lines: string[] = [];
      let currentLine = words[0];
      
      // Create lines with roughly equal lengths
      for (let i = 1; i < words.length; i++) {
        if ((currentLine + " " + words[i]).length < 12) {
          currentLine += " " + words[i];
        } else {
          lines.push(currentLine);
          currentLine = words[i];
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      // Limit to 3 lines
      const displayLines = lines.slice(0, 3);
      if (lines.length > 3) {
        displayLines[2] += "...";
      }
      
      // Render each line with proper spacing
      displayLines.forEach((line, i) => {
        const lineHeight = 14; // Increased line height
        const yPos = (i - (displayLines.length - 1) / 2) * lineHeight;
        
        d3.select(this).append("tspan")
          .attr("x", 0)
          .attr("y", yPos)
          .text(line);
      });
    });

  // Add tooltips for nodes with full label text
  nodeGroup.append("title")
    .text((d: any) => `${cleanTextFn(d.label || d.id)} (${cleanTextFn(d.type) || "Entity"})`);

  return { nodeGroup, node, nodeLabels };
};

// Drag functions 
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
  // Keep position fixed after dragging for better UX
  // event.subject.fx = null;
  // event.subject.fy = null;
};
