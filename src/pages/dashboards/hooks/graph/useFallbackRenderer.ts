
import * as d3 from 'd3';
import { Node } from '../../types/knowledgeGraphTypes';

export const useFallbackRenderer = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  nodes: Node[],
  height: number,
  cleanTextFn: (text: any) => string
) => {
  // Draw unconnected nodes as fallback
  g.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 20)
    .attr("cx", (d, i) => 100 + (i * 150))
    .attr("cy", height / 2)
    .attr("fill", d => {
      // Color based on node type
      switch(d.type) {
        case "outcome": return "#ef4444"; // red
        case "factor": return "#f59e0b";  // amber
        case "intervention": return "#3b82f6"; // blue
        default: return "#10b981"; // emerald
      }
    })
    .append("title")
    .text(d => cleanTextFn(d.label));
  
  g.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", (d, i) => 100 + (i * 150))
    .attr("y", height / 2 + 40)
    .attr("text-anchor", "middle")
    .text(d => cleanTextFn(d.label));
};
