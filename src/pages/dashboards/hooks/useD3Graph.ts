
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
    console.log(`Valid edges for rendering: ${validEdges.length} (from ${edges.length} total)`);
    
    if (validEdges.length === 0 && nodes.length > 0) {
      // Render fallback when there are no valid connections
      console.log("No valid edges found, rendering fallback layout");
      useFallbackRenderer(g, nodes, height, cleanText);
      return;
    }

    // Calculate center position
    const centerX = containerWidth / 2;
    const centerY = height / 2;
    
    // Initialize force simulation with proper center coordinates
    const simulation = useGraphSimulation(
      nodes, 
      validEdges, 
      centerX,
      centerY,
      {
        linkDistance: 220,
        chargeStrength: -800,
        collideRadius: 70
      }
    );
    
    // Render edges and their labels
    const { link, linkBg, linkLabels } = useEdgeRenderer(g, svg, validEdges, cleanText);
    
    // Render nodes and their labels
    const { nodeGroup } = useNodeRenderer(g, nodes, simulation, cleanText);
    
    // Setup the tick function to update positions
    simulation.on("tick", () => {
      // Update link paths
      linkBg.attr("d", (d: any) => {
        if (!d.source.x || !d.target.x) return "";
        return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
      });
      
      link.attr("d", (d: any) => {
        if (!d.source.x || !d.target.x) return "";
        return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
      });

      // Update link label positions
      linkLabels
        .attr("x", (d: any) => {
          if (!d.source.x || !d.target.x) return 0;
          return (d.source.x + d.target.x) / 2;
        })
        .attr("y", (d: any) => {
          if (!d.source.y || !d.target.y) return 0;
          return (d.source.y + d.target.y) / 2 - 8;
        });

      // Update node positions with boundary constraints
      nodeGroup.attr("transform", (d: any) => {
        // Constrain nodes to be within the SVG boundaries with some padding
        const padding = 60;
        const x = Math.max(padding, Math.min(containerWidth - padding, d.x || centerX));
        const y = Math.max(padding, Math.min(height - padding, d.y || centerY));
        
        return `translate(${x},${y})`;
      });
    });

    // Add zoom handler with better defaults
    const zoomHandler = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoomHandler as any);
    
    // Calculate appropriate initial zoom based on node count
    let effectiveZoom = 0.8;
    if (nodes.length > 10) {
      effectiveZoom = 0.6;
    } else if (nodes.length > 5) {
      effectiveZoom = 0.7;
    }
    
    // Apply initial zoom to fit the graph
    svg.call(zoomHandler.transform as any, 
      d3.zoomIdentity
        .translate(containerWidth / 2, height / 2)
        .scale(effectiveZoom)
        .translate(-centerX, -centerY)
    );

    // Handle window resize
    const handleResize = () => {
      if (!svgRef.current) return;
      
      const newWidth = svgRef.current.parentElement?.clientWidth || containerWidth;
      
      svg.attr("width", "100%");
      svg.attr("viewBox", [0, 0, newWidth, height]);
      
      // Update simulation center forces
      simulation.force("center", d3.forceCenter(newWidth / 2, height / 2));
      simulation.force("x", d3.forceX(newWidth / 2).strength(0.07));
      
      // Re-center the graph after resize
      svg.call(zoomHandler.transform as any, 
        d3.zoomIdentity
          .translate(newWidth / 2, height / 2)
          .scale(effectiveZoom)
          .translate(-newWidth / 2, -height / 2)
      );
      
      simulation.alpha(0.3).restart();
    };

    window.addEventListener("resize", handleResize);

    // Run simulation longer for better layout
    simulation.alpha(1).restart();
    
    return () => {
      simulation.stop();
      window.removeEventListener("resize", handleResize);
    };
  }, [svgRef, nodes, edges, height]);
};
