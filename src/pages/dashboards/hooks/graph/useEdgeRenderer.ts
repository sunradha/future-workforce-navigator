
import * as d3 from 'd3';
import { Edge } from '../../types/knowledgeGraphTypes';

export const useEdgeRenderer = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  validEdges: Edge[],
  cleanTextFn: (text: any) => string
) => {
  // Define arrow markers for directional links
  svg.append("defs").selectAll("marker")
    .data(["arrow"])
    .enter()
    .append("marker")
    .attr("id", d => d)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 35)  // Increased offset to avoid overlap with larger nodes
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#666");  // Darker color for better visibility

  // Add links (edges) with arrows
  const link = g.append("g")
    .attr("class", "links")
    .selectAll("path")
    .data(validEdges)
    .enter()
    .append("path")
    .attr("stroke", "#666")
    .attr("stroke-opacity", 0.8)
    .attr("stroke-width", 2.5) // Thicker lines
    .attr("fill", "none")
    .attr("marker-end", "url(#arrow)");
  
  // Add edge labels with better positioning
  const linkLabels = g.append("g")
    .attr("class", "link-labels")
    .selectAll("text")
    .data(validEdges)
    .enter()
    .append("text")
    .text(d => cleanTextFn(d.relationship))
    .attr("font-size", "11px")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("fill", "#333")
    .attr("dy", "-8") // Move text above the line
    .attr("background", "white");
  
  // Add white background rectangle for better readability
  linkLabels.each(function() {
    const bbox = this.getBBox();
    const padding = 3;
    
    const parentGroup = d3.select(this.parentNode as Element);
    
    parentGroup.insert("rect", "text")
      .attr("x", bbox.x - padding)
      .attr("y", bbox.y - padding)
      .attr("width", bbox.width + (padding * 2))
      .attr("height", bbox.height + (padding * 2))
      .attr("fill", "white")
      .attr("rx", 3) // Rounded corners
      .attr("ry", 3)
      .attr("fill-opacity", 0.9);
  });

  return { link, linkLabels };
};
