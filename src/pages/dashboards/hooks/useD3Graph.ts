import { useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { Node, Edge } from '../types/knowledgeGraphTypes';

interface UseD3GraphProps {
  svgRef: React.RefObject<SVGSVGElement>;
  nodes: Node[];
  edges: Edge[];
  height: number;
}

export const useD3Graph = ({ svgRef, nodes, edges, height }: UseD3GraphProps) => {
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
      .attr("style", "max-width: 100%; height: auto;")
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
      .attr("refX", 25) // Position closer to nodes
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#ddd"); // Lighter color for better visibility

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
      .attr("stroke", "#ddd") // Lighter edge color for dark background
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", 2.5)
      .attr("marker-end", "url(#arrowhead)")
      .attr("fill", "none");

    // Draw link labels
    const linkLabels = g.append("g")
      .selectAll("g")
      .data(edges)
      .enter()
      .append("g");

    // Add background for link labels
    linkLabels.append("rect")
      .attr("fill", "rgba(60, 60, 60, 0.9)") // Darker semi-transparent background
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("opacity", 0.9);

    // Add text for link labels
    const linkText = linkLabels.append("text")
      .text(d => formatRelationship(d.relationship))
      .attr("font-size", "13px") // Increased font size for better visibility
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("pointer-events", "none")
      .attr("fill", "#fff") // White text for dark background
      .attr("font-weight", "500");

    // Size the rectangles based on text content
    linkLabels.selectAll("text").each(function(this: SVGTextElement) {
      const bbox = this.getBBox();
      const parent = d3.select(this.parentNode as any);
      parent.select("rect")
        .attr("x", bbox.x - 6) // More padding
        .attr("y", bbox.y - 4)
        .attr("width", bbox.width + 12) // More padding
        .attr("height", bbox.height + 8); // More padding
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
      .attr("stroke", "#fff")
      .attr("stroke-width", 2.5);

    // Add node labels (WHITE text for better contrast on colored nodes)
    nodeGroups.append("text")
      .text(d => formatLabel(d.label))
      .attr("font-size", "14px") // Increased font size
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#ffffff") // WHITE text for better visibility inside colored nodes
      .attr("pointer-events", "none")
      .each(function(d) {
        const text = d3.select(this);
        const words = formatLabel(d.label).split(/\s+/);
        const lineHeight = 1.1;
        
        text.text(null); // Clear the text
        
        if (words.length === 1 || d.label.length < 12) {
          text.text(formatLabel(d.label));
          return;
        }
        
        // For multi-word labels, split into lines
        const maxWords = 2;
        for (let i = 0; i < words.length; i += maxWords) {
          const lineWords = words.slice(i, i + maxWords);
          text.append("tspan")
            .attr("x", 0)
            .attr("y", (i === 0 ? -0.6 : 0.6) + "em")
            .text(lineWords.join(' '));
        }
      });

    // Add tooltips
    nodeGroups.append("title")
      .text(d => `${d.label} (${d.type || 'Entity'})`);

    // Function to update positions of all elements
    function updatePositions() {
      // Constrain nodes to the SVG bounds
      nodes.forEach(node => {
        node.x = Math.max(45, Math.min(width - 45, node.x || width/2));
        node.y = Math.max(45, Math.min(height - 45, node.y || height/2));
      });
      
      // Update link paths with smoother curves
      link.attr("d", (d: any) => {
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        
        // Calculate the path with a slight curve
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.2; // Adjust the curve
        
        return `M${sourceX},${sourceY}A${dr},${dr} 0 0,1 ${targetX},${targetY}`;
      });
      
      // Update link label positions
      linkLabels.attr("transform", (d: any) => {
        const x = (d.source.x + d.target.x) / 2;
        const y = (d.source.y + d.target.y) / 2;
        return `translate(${x},${y - 10})`;
      });
      
      // Update node positions
      nodeGroups.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    }
    
    // Run the simulation for more iterations to position nodes before first render
    // This ensures initial positions are calculated before display
    for (let i = 0; i < 100; i++) {
      simulation.tick();
    }
    
    // Update positions immediately after simulation
    updatePositions();
    
    // Apply initial zoom to ensure everything is visible
    const initialScale = 0.85; // Slightly zoomed out to show the whole graph
    svg.call(zoom.transform as any, 
      d3.zoomIdentity
        .translate(width/2, height/2)
        .scale(initialScale)
        .translate(-width/2, -height/2)
    );
    
    // Drag functions with proper handling to ensure only the dragged node moves
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      // Store fx and fy (fixed position) for the dragged node only
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event: any) {
      // Update only the dragged node's position
      event.subject.fx = event.x;
      event.subject.fy = event.y;
      // Call update to refresh positions
      updatePositions();
    }
    
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      // Keep the node position fixed after dragging
      // Don't reset fx/fy to null to keep the node in place
    }
    
    // Helper functions
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
      const formatted = relationship
        .replace(/_/g, ' ')
        .toLowerCase();
      
      return formatted.length > 15 ? 
        formatted.substring(0, 12) + "..." : 
        formatted;
    }

    // Let the simulation run for a bit to better position elements
    simulation
      .alpha(0.3)
      .restart();

    simulation.on('tick', updatePositions);
    
  }, [svgRef, nodes, edges, height]);

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
        }, 500);
      }, 200);
      
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
