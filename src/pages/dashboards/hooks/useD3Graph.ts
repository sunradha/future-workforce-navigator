import { useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { Node, Edge } from '../types/knowledgeGraphTypes';

interface UseD3GraphProps {
  svgRef: React.RefObject<SVGSVGElement>;
  nodes: Node[];
  edges: Edge[];
  height: number;
  darkMode?: boolean;
}

export const useD3Graph = ({ svgRef, nodes, edges, height, darkMode = false }: UseD3GraphProps) => {
  const renderGraph = useCallback(() => {
    if (!svgRef.current || !nodes.length) {
      console.log("No SVG ref or nodes to render");
      return;
    }

    // Clear any existing graph
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Get the width of the container
    const width = svgRef.current.parentElement?.clientWidth || 800;

    // Set SVG attributes and viewport
    svg
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height].join(" "))
      .attr("style", `max-width: 100%; height: auto; background: ${darkMode ? "#1A1F2C" : "#f0f0f0"};`)
      .attr("font-family", "sans-serif");

    // Create a group element for the entire graph
    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Define arrow marker for directed edges
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 60) // Position it further away to ensure it's at the edge of circle
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", darkMode ? "#FFFFFF" : "#666"); // White arrows in dark mode

    // Create a color scale for node types
    const colorScale = d3.scaleOrdinal()
      .domain(['entity', 'employee', 'occupation', 'industry', 'training', 'reskilling_case', 'reskilling_event', 'skill', 'location'])
      .range(['#8B5CF6', '#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#EC4899', '#F97316', '#F59E0B', '#8B5CF6']);

    // Create the simulation with increased repulsion strength
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(edges)
        .id((d: any) => d.id)
        .distance(180)) // Increased distance between nodes
      .force("charge", d3.forceManyBody().strength(-1500)) // Stronger repulsion
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(80)); // Increased collision radius

    // Draw the links
    const link = g.append("g")
      .selectAll("path")
      .data(edges)
      .enter()
      .append("path")
      .attr("stroke", darkMode ? "#FFFFFF" : "#666") // White edge color in dark mode
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", 2.5)
      .attr("marker-end", "url(#arrowhead)")
      .attr("fill", "none");

    // Draw link labels - with improved background
    const linkLabels = g.append("g")
      .selectAll("g")
      .data(edges)
      .enter()
      .append("g");

    // Add background for link labels (darker in dark mode)
    linkLabels.append("rect")
      .attr("fill", darkMode ? "rgba(40, 44, 52, 0.9)" : "rgba(240, 240, 240, 0.9)") 
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("opacity", 0.9);

    // Add text for link labels - Display full relationship text
    const linkText = linkLabels.append("text")
      .text(d => formatRelationship(d.relationship))
      .attr("font-size", "13px")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("pointer-events", "none")
      .attr("fill", darkMode ? "#FFFFFF" : "#333") // White text in dark mode
      .attr("font-weight", "500");

    // Size the rectangles based on text content
    linkLabels.selectAll("text").each(function(this: SVGTextElement) {
      const bbox = this.getBBox();
      const parent = d3.select(this.parentNode as any);
      parent.select("rect")
        .attr("x", bbox.x - 8) // More padding
        .attr("y", bbox.y - 6)
        .attr("width", bbox.width + 16) // More padding
        .attr("height", bbox.height + 12); // More padding
    });

    // Draw the nodes
    const nodeGroups = g.append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add node circles with explicit typing for the fill attribute
    nodeGroups.append("circle")
      .attr("r", 45) // Increased node size
      .attr("fill", function(d: Node) {
        return colorScale(d.type || 'entity') as string;
      })
      .attr("stroke", darkMode ? "#FFFFFF" : "#fff") // White stroke in dark mode
      .attr("stroke-width", 2);

    // Add node labels with white text - using a single label with wrapping
    nodeGroups.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#FFFFFF") // Always white for visibility
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .attr("pointer-events", "none")
      .each(function(d) {
        const text = d3.select(this);
        const words = formatLabel(d.label).split(/\s+/);
        
        text.text(null); // Clear the text
        
        // For multi-word labels, split into lines with proper placement
        const lineHeight = 1.1; // Line height factor
        let currentLine = 0;
        let lineWords: string[] = [];
        
        words.forEach((word, i) => {
          lineWords.push(word);
          
          // Create a new line after every 2 words or at the end
          if ((i + 1) % 2 === 0 || i === words.length - 1) {
            text.append("tspan")
              .attr("x", 0)
              .attr("y", 0)
              .attr("dy", ((currentLine === 0 ? 0 : lineHeight) + (currentLine - Math.floor(words.length / 2) * 0.5)) + "em")
              .text(lineWords.join(' '));
            
            lineWords = [];
            currentLine++;
          }
        });
      });

    // Add tooltips
    nodeGroups.append("title")
      .text(d => `${d.label} (${d.type || 'Entity'})`);

    // Function to update positions of all elements
    function updatePositions() {
      // Update link paths with smoother curves
      link.attr("d", (d: any) => {
        const sourceX = d.source.x || 0;
        const sourceY = d.source.y || 0;
        const targetX = d.target.x || 0;
        const targetY = d.target.y || 0;
        
        // Calculate distance for proper arrow placement
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // Smoother curve
        
        return `M${sourceX},${sourceY}A${dr},${dr} 0 0,1 ${targetX},${targetY}`;
      });
      
      // Update link label positions
      linkLabels.attr("transform", (d: any) => {
        if (!d.source || !d.target || d.source.x === undefined || d.target.x === undefined) {
          return "translate(0,0)";
        }
        
        const x = (d.source.x + d.target.x) / 2;
        const y = (d.source.y + d.target.y) / 2;
        
        // Calculate angle to offset the label
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Add vertical offset to avoid overlap with the link
        const offset = angle > 90 || angle < -90 ? 15 : -15;
        
        return `translate(${x},${y + offset})`;
      });
      
      // Update node positions
      nodeGroups.attr("transform", (d: any) => {
        const x = d.x || 0;
        const y = d.y || 0;
        return `translate(${x},${y})`;
      });
    }
    
    // Run the simulation for more iterations to position nodes before first render
    for (let i = 0; i < 100; i++) {
      simulation.tick();
    }
    
    // Update positions immediately after simulation
    updatePositions();
    
    // Apply initial zoom to ensure everything is visible
    const initialScale = 0.85; // Slightly zoomed out
    svg.call(zoom.transform as any, 
      d3.zoomIdentity
        .translate(width/2, height/2)
        .scale(initialScale)
        .translate(-width/2, -height/2)
    );
    
    // Drag functions with proper typing
    function dragstarted(event: d3.D3DragEvent<SVGGElement, any, any>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      // Fix only the dragged node
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event: d3.D3DragEvent<SVGGElement, any, any>) {
      // Update only the dragged node's position
      event.subject.fx = event.x;
      event.subject.fy = event.y;
      // Call update to refresh positions
      updatePositions();
    }
    
    function dragended(event: d3.D3DragEvent<SVGGElement, any, any>) {
      if (!event.active) simulation.alphaTarget(0);
      // Keep the node position fixed after dragging
    }
    
    // Helper functions for formatting labels
    function formatLabel(label: string): string {
      if (!label) return '';
      
      return label
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    function formatRelationship(relationship: string): string {
      if (!relationship) return '';
      
      return relationship
        .replace(/_/g, ' ')
        .toLowerCase();
    }

    // Let the simulation run for a bit to better position elements
    simulation
      .alpha(0.3)
      .restart();

    simulation.on('tick', updatePositions);
    
    // Log successful rendering
    console.log("Graph rendered successfully with", nodes.length, "nodes and", edges.length, "edges");
    
  }, [svgRef, nodes, edges, height, darkMode]);

  useEffect(() => {
    console.log("useD3Graph effect triggered, nodes:", nodes.length);
    
    // Only render if we have nodes
    if (nodes.length > 0) {
      // Small timeout to ensure the DOM is ready
      const timer = setTimeout(() => {
        console.log("Rendering graph");
        renderGraph();
        
        // Force another render after a short delay to ensure proper rendering
        setTimeout(() => {
          console.log("Re-rendering graph for final positioning");
          renderGraph();
        }, 300);
      }, 100);
      
      return () => clearTimeout(timer);
    }
    
    // Add resize listener
    const handleResize = () => renderGraph();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderGraph, nodes.length]);
};
