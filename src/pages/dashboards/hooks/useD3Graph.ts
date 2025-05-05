
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
    if (!svgRef.current || !nodes.length || !edges.length) {
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
    
    if (validEdges.length === 0) {
      // Render fallback when there are no valid connections
      useFallbackRenderer(g, nodes, height, cleanText);
      return;
    }

    // Initialize the force simulation
    const simulation = useGraphSimulation(
      nodes, 
      validEdges, 
      containerWidth / 2, 
      height / 2
    );
    
    // Render edges and their labels
    const { link, linkLabels } = useEdgeRenderer(g, svg, validEdges, cleanText);
    
    // Render nodes and their labels
    const { nodeGroup } = useNodeRenderer(g, nodes, simulation, cleanText);
    
    // Setup the tick function to update positions on each simulation step
    simulation.on("tick", () => {
      // Update link paths for curved edges
      link.attr("d", (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        
        // Direct path for self-loops
        if (d.source === d.target) {
          return `M${d.source.x},${d.source.y} A1,1 0 0,1 ${d.target.x},${d.target.y}`;
        }
        
        // Curved path for normal links
        return `M${d.source.x},${d.source.y} A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      // Update link label positions
      linkLabels
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);

      // Update node group positions
      nodeGroup
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

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

    // Start simulation
    simulation.restart();
    
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
