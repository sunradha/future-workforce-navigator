
import * as d3 from 'd3';
import { RefObject } from 'react';

interface GraphSetupResult {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  g: d3.Selection<SVGGElement, unknown, null, undefined>;
  containerWidth: number;
  zoom: d3.ZoomBehavior<Element, unknown>;
}

export const useGraphSetup = (
  svgRef: RefObject<SVGSVGElement>,
  height: number
): GraphSetupResult | null => {
  if (!svgRef.current) return null;
  
  // Clear previous graph
  d3.select(svgRef.current).selectAll("*").remove();

  const containerWidth = svgRef.current.parentElement?.clientWidth || 800;
  const svg = d3.select(svgRef.current)
    .attr("width", "100%")  // Set to 100% for responsive behavior
    .attr("height", height)
    .attr("viewBox", [0, 0, containerWidth, height])
    .attr("preserveAspectRatio", "xMidYMid meet"); // Keep the aspect ratio and center the graph

  // Add zoom capability with improved settings
  const zoom = d3.zoom()
    .scaleExtent([0.2, 3])  // Allow more zoom out
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  svg.call(zoom as any);
  
  // Create a container for the graph
  const g = svg.append("g");

  return { svg, g, containerWidth, zoom };
};
