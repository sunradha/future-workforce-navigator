
import { useEffect } from 'react';
import * as d3 from 'd3';
import { UseD3GraphProps } from './graph/types';
import { useGraphSetup } from './graph/useGraphSetup';
import { useGraphSimulation } from './graph/useGraphSimulation';
import { useTextUtilities } from './graph/useTextUtilities';
import { useEdgeRenderer } from './graph/useEdgeRenderer';
import { useNodeRenderer } from './graph/useNodeRenderer';
import { useFallbackRenderer } from './graph/useFallbackRenderer';
import { useValidationUtils } from './graph/useValidationUtils';

export const useD3Graph = ({ svgRef, nodes, edges, height }: UseD3GraphProps) => {
  useEffect(() => {
    if (!svgRef.current || !nodes.length) {
      console.log("Missing required data for graph:", { 
        svgRef: !!svgRef.current, 
        nodesLength: nodes.length, 
        edgesLength: edges.length 
      });
      return;
    }
    
    console.log(`Rendering graph with ${nodes.length} nodes and ${edges.length} edges`);
    
    // Initialize utilities and validation
    const { cleanText } = useTextUtilities();
    const { validateEdges } = useValidationUtils();
    
    // Setup the SVG and container
    const setupResult = useGraphSetup(svgRef, height);
    if (!setupResult) return;
    
    const { svg, g, containerWidth } = setupResult;
    
    // Validate edges against nodes
    const validEdges = validateEdges(edges, nodes);
    
    console.log("Valid edges for rendering:", validEdges.length);
    
    if (validEdges.length === 0 && nodes.length > 0) {
      // Render fallback when there are no valid connections
      console.log("No valid edges found, rendering fallback layout");
      useFallbackRenderer(g, nodes, height, cleanText);
      return;
    }

    // Initialize the force simulation with better positioning
    const simulation = useGraphSimulation(
      nodes, 
      validEdges, 
      containerWidth / 2, 
      height / 2,
      {
        linkDistance: 200,
        chargeStrength: -800,
        collideRadius: 80
      }
    );
    
    // Render edges and their labels
    const { link, linkLabels } = useEdgeRenderer(g, svg, validEdges, cleanText);
    
    // Render nodes and their labels
    const { nodeGroup } = useNodeRenderer(g, nodes, simulation, cleanText);
    
    // Setup the tick function to update positions on each simulation step
    simulation.on("tick", () => {
      // Update link paths for curved edges
      link.attr("d", (d: any) => {
        // Get source and target coordinates
        const sourceX = d.source.x || 0;
        const sourceY = d.source.y || 0;
        const targetX = d.target.x || 0;
        const targetY = d.target.y || 0;
        
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const dr = Math.sqrt(dx * dx + dy * dy);
        
        // Direct path for self-loops
        if (d.source === d.target) {
          return `M${sourceX},${sourceY} A1,1 0 0,1 ${targetX},${targetY}`;
        }
        
        // Curved path for normal links
        return `M${sourceX},${sourceY} A${dr},${dr} 0 0,1 ${targetX},${targetY}`;
      });

      // Update link label positions to be at the midpoint
      linkLabels
        .attr("x", (d: any) => {
          const sourceX = d.source.x || 0;
          const targetX = d.target.x || 0;
          return (sourceX + targetX) / 2;
        })
        .attr("y", (d: any) => {
          const sourceY = d.source.y || 0;
          const targetY = d.target.y || 0;
          return (sourceY + targetY) / 2;
        });

      // Update node group positions
      nodeGroup
        .attr("transform", (d: any) => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Add a zoom handler with better initial zoom
    const zoomHandler = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoomHandler);
    
    // Initial zoom to fit the graph better
    const initialZoom = 0.9; // Zoom out slightly
    const initialTransform = d3.zoomIdentity
      .translate(containerWidth / 2, height / 2)
      .scale(initialZoom)
      .translate(-containerWidth / 2, -height / 2);
    
    svg.call(zoomHandler.transform, initialTransform);

    // Add a resize event listener
    const handleResize = () => {
      if (!svgRef.current) return;
      
      const newWidth = svgRef.current.parentElement?.clientWidth || 800;
      svg.attr("width", newWidth);
      svg.attr("viewBox", [0, 0, newWidth, height]);
      simulation.force("center", d3.forceCenter(newWidth / 2, height / 2));
      simulation.alpha(0.3).restart();
    };

    window.addEventListener("resize", handleResize);

    // Start simulation with higher alpha for better initial layout
    simulation.alpha(0.8).restart();
    
    // Stop simulation after 3 seconds to save resources, 
    // but leave it running longer initially for better layout
    setTimeout(() => {
      simulation.stop();
      console.log('Stopped simulation to save resources');
    }, 3000);

    return () => {
      simulation.stop();
      window.removeEventListener("resize", handleResize);
    };
  }, [svgRef, nodes, edges, height]);
};
