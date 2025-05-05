import { useEffect, RefObject } from 'react';
import * as d3 from 'd3';
import { Node, Edge } from '../types/knowledgeGraphTypes';

interface UseD3GraphProps {
  svgRef: RefObject<SVGSVGElement>;
  nodes: Node[];
  edges: Edge[];
  height: number;
}

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
    console.log("Nodes:", nodes);
    console.log("Edges:", edges);
    
    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    const containerWidth = svgRef.current.parentElement?.clientWidth || 800;
    const svg = d3.select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", height)
      .attr("viewBox", [0, 0, containerWidth, height]);

    // Add zoom capability
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);
    
    // Create a container for the graph
    const g = svg.append("g");

    // Create a map for faster node lookup
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    
    // Validate edges to ensure they connect to existing nodes
    const validEdges = edges.filter(edge => 
      nodeMap.has(edge.source) && nodeMap.has(edge.target)
    );
    
    if (validEdges.length === 0) {
      console.error("No valid edges found - all edges reference non-existent nodes");
      
      // Draw unconnected nodes as fallback
      g.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 20)
        .attr("cx", (d, i) => 100 + (i * 150))
        .attr("cy", height / 2)
        .attr("fill", "#3b82f6")
        .append("title")
        .text(d => d.label);
      
      g.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", (d, i) => 100 + (i * 150))
        .attr("y", height / 2 + 40)
        .attr("text-anchor", "middle")
        .text(d => cleanText(d.label));
      
      return;
    }

    // Create the graph simulation with improved parameters for causal graphs
    const simulation = d3.forceSimulation()
      .force("link", d3.forceLink()
        .id((d: any) => d.id)
        .distance(150) // Increased distance for causal graphs
        .strength(1)
      )
      .force("charge", d3.forceManyBody().strength(-500)) // Stronger repulsion
      .force("collide", d3.forceCollide().radius(80).strength(1))
      .force("center", d3.forceCenter(containerWidth / 2, height / 2));

    // Helper function to safely clean and format text
    const cleanText = (text: any): string => {
      // Handle null or undefined
      if (text === null || text === undefined) {
        return 'N/A';
      }
      
      // If it's a string, clean it
      if (typeof text === 'string') {
        // Remove quotes, [object Object], and other undesirable formatting
        return text.replace(/['"]+/g, '').replace(/\[object Object\]/g, '');
      }
      
      // If it's an object with a toString method that would return [object Object],
      // try to get a better representation
      if (typeof text === 'object') {
        // Try to use label or name property if available
        if (text.label) return cleanText(text.label);
        if (text.name) return cleanText(text.name);
        if (text.id) return cleanText(text.id);
        
        // Last resort - stringified with JSON
        try {
          return JSON.stringify(text).substring(0, 15);
        } catch (e) {
          return 'Complex Object';
        }
      }
      
      // For numbers, booleans, etc.
      return String(text);
    };

    // Add links (edges) with arrows
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(validEdges)
      .enter()
      .append("path")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("marker-end", "url(#arrow)");
    
    // Define arrow markers for directional links
    svg.append("defs").selectAll("marker")
      .data(["arrow"])
      .enter()
      .append("marker")
      .attr("id", d => d)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)  // Offset so that the arrow doesn't overlap the node
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Add edge labels - use all edges for causal graphs as they're important
    const linkLabels = g.append("g")
      .attr("class", "link-labels")
      .selectAll("text")
      .data(validEdges)
      .enter()
      .append("text")
      .text(d => cleanText(d.relationship))
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("fill", "#555")
      .attr("dy", "-5");

    // Color scale for node types
    const color = d3.scaleOrdinal()
      .domain(["outcome", "factor", "intervention", "Entity"])
      .range(["#ef4444", "#f59e0b", "#3b82f6", "#10b981"]);

    // Create node groups
    const nodeGroup = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Add node circles
    const node = nodeGroup.append("circle")
      .attr("r", 20)
      .attr("fill", (d: any) => {
        // Get color based on node type
        const nodeType = cleanText(d.type) || "Entity";
        return color(nodeType);
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add node labels
    const nodeLabels = nodeGroup.append("text")
      .text((d: any) => cleanText(d.label))
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("dx", 0)
      .attr("dy", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#333");

    // Add tooltips for nodes
    node.append("title")
      .text((d: any) => `${cleanText(d.label)} (${cleanText(d.type) || "Unknown Type"})`);

    simulation.nodes(nodes as any).on("tick", ticked);
    (simulation.force("link") as d3.ForceLink<any, any>).links(validEdges);

    // Run the simulation with higher alpha for better initial layout
    simulation.alpha(1).restart();

    function ticked() {
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
    }

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      
      // Keep nodes in fixed positions after drag for causal graphs
      // This makes the graph more stable
      // event.subject.fx = null;
      // event.subject.fy = null;
    }

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
