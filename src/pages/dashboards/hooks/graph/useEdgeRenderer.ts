
import * as d3 from 'd3';
import { Edge } from '../../types/knowledgeGraphTypes';

export const useEdgeRenderer = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  validEdges: Edge[],
  cleanTextFn: (text: any) => string
) => {
  // Define arrow markers for directional links with improved placement
  svg.append("defs").selectAll("marker")
    .data(["arrow"])
    .enter()
    .append("marker")
    .attr("id", d => d)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 42)  // Further from node center for better visibility
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#666");

  // Add links container first to ensure edges are behind nodes
  const linksGroup = g.append("g").attr("class", "links");
  
  // Add link background for better label visibility
  const linkBg = linksGroup.selectAll("path.link-bg")
    .data(validEdges)
    .enter()
    .append("path")
    .attr("class", "link-bg")
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.9)
    .attr("stroke-width", 6)
    .attr("fill", "none");

  // Add links (edges) with arrows
  const link = linksGroup.selectAll("path.link")
    .data(validEdges)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("stroke", "#666")
    .attr("stroke-opacity", 0.8)
    .attr("stroke-width", 1.5) 
    .attr("fill", "none")
    .attr("marker-end", "url(#arrow)");
  
  // Add edge labels group
  const labelGroup = g.append("g").attr("class", "link-labels");
  
  // Add white label backgrounds first
  const labelBgs = labelGroup.selectAll("rect")
    .data(validEdges)
    .enter()
    .append("rect")
    .attr("fill", "white")
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill-opacity", 0.9)
    .attr("stroke", "#f0f0f0")
    .attr("stroke-width", 0.5);

  // Add text over the backgrounds
  const linkLabels = labelGroup.selectAll("text")
    .data(validEdges)
    .enter()
    .append("text")
    .attr("class", "link-label")
    .text(d => {
      // Format relationship text to be more readable
      const rel = cleanTextFn(d.relationship);
      // Format text for better readability
      const formattedRel = rel
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      return formattedRel.length > 16 ? formattedRel.substring(0, 14) + '...' : formattedRel;
    })
    .attr("font-size", "10px")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("dy", "-0.5em") // Move text above the line
    .attr("fill", "#333");

  // Size backgrounds to match text
  linkLabels.each(function(this: SVGTextElement) {
    const bbox = this.getBBox();
    const padding = 3;
    
    // Find the index of the current element in the linkLabels selection
    const currentElement = this;
    const index = linkLabels.nodes().indexOf(currentElement);
    
    labelBgs.filter((_, i) => i === index)
      .attr("x", bbox.x - padding)
      .attr("y", bbox.y - padding)
      .attr("width", bbox.width + (padding * 2))
      .attr("height", bbox.height + (padding * 2));
  });

  return { link, linkBg, linkLabels };
};
