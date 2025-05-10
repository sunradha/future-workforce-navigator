
import * as d3 from 'd3';
import { Edge } from '../../types/knowledgeGraphTypes';

export const useEdgeRenderer = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  validEdges: Edge[],
  cleanTextFn: (text: any) => string
) => {
  // Define arrow markers for directional links - moved farther from node
  svg.append("defs").selectAll("marker")
    .data(["arrow"])
    .enter()
    .append("marker")
    .attr("id", d => d)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 38)  // Increased offset to avoid overlap with larger nodes
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#666");  // Darker color for better visibility

  // Add links container first so they appear behind nodes
  const linksGroup = g.append("g").attr("class", "links");
  
  // Add link background for better label visibility
  const linkBg = linksGroup.selectAll("path.link-bg")
    .data(validEdges)
    .enter()
    .append("path")
    .attr("class", "link-bg")
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.9)
    .attr("stroke-width", 6) // Wider than the actual link
    .attr("fill", "none");

  // Add links (edges) with arrows
  const link = linksGroup.selectAll("path.link")
    .data(validEdges)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("stroke", "#666")
    .attr("stroke-opacity", 0.8)
    .attr("stroke-width", 2) 
    .attr("fill", "none")
    .attr("marker-end", "url(#arrow)");
  
  // Add edge labels with improved positioning and background
  const labelGroup = g.append("g").attr("class", "link-labels");
  
  // Add white label backgrounds first (rect)
  const labelBgs = labelGroup.selectAll("rect")
    .data(validEdges)
    .enter()
    .append("rect")
    .attr("fill", "white")
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill-opacity", 0.85)
    .attr("stroke", "#f0f0f0")
    .attr("stroke-width", 0.5);

  // Then add text over the backgrounds
  const linkLabels = labelGroup.selectAll("text")
    .data(validEdges)
    .enter()
    .append("text")
    .attr("class", "link-label")
    .text(d => {
      // Format relationship text to be more readable
      const rel = cleanTextFn(d.relationship);
      return rel.length > 20 ? rel.substring(0, 18) + '...' : rel;
    })
    .attr("font-size", "9px")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("dy", "-0.5em") // Move text above the line
    .attr("fill", "#333");

  // Size backgrounds to match text
  linkLabels.each(function() {
    const bbox = this.getBBox();
    const padding = 3;
    
    // Find matching background rectangle
    const index = d3.select(this).datum();
    
    labelBgs.filter(d => d === index)
      .attr("x", bbox.x - padding)
      .attr("y", bbox.y - padding)
      .attr("width", bbox.width + (padding * 2))
      .attr("height", bbox.height + (padding * 2));
  });

  return { link, linkBg, linkLabels };
};
