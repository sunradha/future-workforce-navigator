
import { useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { Node, Edge } from '../types/knowledgeGraphTypes';

interface UseD3GraphProps {
  svgRef: React.RefObject<SVGSVGElement>;
  nodes: Node[];
  edges: Edge[];
  height: number;
  darkMode?: boolean;
  colorScale?: Record<string, string>;
}

export const useD3Graph = ({ 
  svgRef, 
  nodes, 
  edges, 
  height, 
  darkMode = false,
  colorScale = {} 
}: UseD3GraphProps) => {
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

    // Calculate node radius - we'll use this for arrow positioning
    const nodeRadius = 45;

    // Create multiple arrow markers with different IDs for different curve types
    const defs = svg.append("defs");
    
    // Normal arrow marker for straight lines
    defs.append("marker")
      .attr("id", "arrowhead-straight")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", nodeRadius + 3) // Position closer to target node edge
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", darkMode ? "#FFFFFF" : "#666");
      
    // Arrow marker for curved lines
    defs.append("marker")
      .attr("id", "arrowhead-curved")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", nodeRadius + 5) // Position slightly further for curved lines
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", darkMode ? "#FFFFFF" : "#666");

    // Create a color scale for node types - use custom colors if provided
    const defaultColorScale = d3.scaleOrdinal()
      .domain(['entity', 'employee', 'occupation', 'industry', 'training', 'reskilling_case', 'reskilling_event', 'skill', 'location', 'process', 'start', 'certification', 'outcome', 'transition', 'skill_category'])
      .range(['#8B5CF6', '#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#EC4899', '#F97316', '#F59E0B', '#8B5CF6', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8B5CF6']);

    // Function to determine color for a node
    const getNodeColor = (node: Node): string => {
      const nodeType = node.type || 'entity';
      // If a custom color is provided for this type, use it; otherwise use default scale
      if (colorScale && colorScale[nodeType]) {
        return colorScale[nodeType];
      }
      if (colorScale && colorScale['default']) {
        return colorScale['default'];
      }
      return defaultColorScale(nodeType) as string;
    };

    // Create the simulation with increased repulsion strength
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(edges)
        .id((d: any) => d.id)
        .distance(180)) // Increased distance between nodes
      .force("charge", d3.forceManyBody().strength(-1500)) // Stronger repulsion
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(80)); // Increased collision radius

    // Draw the links - Improved edge connections with proper path calculation
    const link = g.append("g")
      .selectAll("path")
      .data(edges)
      .enter()
      .append("path")
      .attr("stroke", darkMode ? "#FFFFFF" : "#666") // White edge color in dark mode
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", 2.5)
      .attr("fill", "none");

    // Draw link labels - with improved background
    const linkLabels = g.append("g")
      .selectAll("g")
      .data(edges)
      .enter()
      .append("g");

    // Add background for link labels
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

    // Add node circles with explicit typing for the fill attribute - updated to use custom colors
    nodeGroups.append("circle")
      .attr("r", nodeRadius) // Using our defined nodeRadius
      .attr("fill", function(d: Node) {
        return getNodeColor(d);
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

    // Function to update positions of all elements - Improved edge path calculation
    function updatePositions() {
      // Update link paths with improved arrow positioning
      link.attr("d", (d: any) => {
        if (!d.source || !d.target || !d.source.x || !d.target.x) {
          return "M0,0L0,0";
        }
        
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        
        // Calculate angle for proper edge connection to node circumference
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate points on the circumference of source and target nodes
        const sourceNodeEdgeX = sourceX + Math.cos(angle) * nodeRadius;
        const sourceNodeEdgeY = sourceY + Math.sin(angle) * nodeRadius;
        
        // For the target, we calculate backwards to ensure the arrow connects properly
        const targetNodeEdgeX = targetX - Math.cos(angle) * (nodeRadius + 2); // Add small offset for better arrow connection
        const targetNodeEdgeY = targetY - Math.sin(angle) * (nodeRadius + 2);
        
        // Choose between curved or straight lines based on relationship and distance
        const isBidirectional = edges.some((otherEdge: any) => 
          (otherEdge.source.id === d.target.id && otherEdge.target.id === d.source.id) ||
          (otherEdge !== d && otherEdge.source.id === d.source.id && otherEdge.target.id === d.target.id)
        );
        
        // Self-referential loop detection
        const isSelfLoop = d.source.id === d.target.id;
        
        if (isSelfLoop) {
          // Special case for self-loops
          const loopSize = nodeRadius * 1.5;
          const controlPointX = sourceX + loopSize;
          const controlPointY = sourceY - loopSize;
          
          // Use the curved arrow marker
          d3.select(this).attr("marker-end", "url(#arrowhead-curved)");
          
          return `M${sourceNodeEdgeX},${sourceNodeEdgeY} Q${controlPointX},${controlPointY} ${sourceX + nodeRadius * 0.7},${sourceY - nodeRadius * 0.7}`;
        } else if (isBidirectional || distance < nodeRadius * 4) {
          // Use more pronounced curves for shorter distances or bidirectional relationships
          const curvature = distance < nodeRadius * 3 ? 0.4 : 0.2;
          const midX = (sourceNodeEdgeX + targetNodeEdgeX) / 2;
          const midY = (sourceNodeEdgeY + targetNodeEdgeY) / 2;
          const offX = midX + curvature * (targetNodeEdgeY - sourceNodeEdgeY);
          const offY = midY - curvature * (targetNodeEdgeX - sourceNodeEdgeX);
          
          // Use the curved arrow marker
          d3.select(this).attr("marker-end", "url(#arrowhead-curved)");
          
          return `M${sourceNodeEdgeX},${sourceNodeEdgeY} Q${offX},${offY} ${targetNodeEdgeX},${targetNodeEdgeY}`;
        } else {
          // Use straight lines for longer distances with no bidirectional relationship
          // Use the straight arrow marker
          d3.select(this).attr("marker-end", "url(#arrowhead-straight)");
          
          return `M${sourceNodeEdgeX},${sourceNodeEdgeY} L${targetNodeEdgeX},${targetNodeEdgeY}`;
        }
      });
      
      // Set appropriate marker-end for all paths (this fixes the arrow issue)
      link.each(function(d: any) {
        const path = d3.select(this);
        const source = d.source;
        const target = d.target;
        
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Check if there are bidirectional edges or self-loops
          const isBidirectional = edges.some((otherEdge: any) => 
            (otherEdge.source.id === target.id && otherEdge.target.id === source.id) ||
            (otherEdge !== d && otherEdge.source.id === source.id && otherEdge.target.id === target.id)
          );
          
          const isSelfLoop = source.id === target.id;
          
          if (isSelfLoop || isBidirectional || distance < nodeRadius * 4) {
            path.attr("marker-end", "url(#arrowhead-curved)");
          } else {
            path.attr("marker-end", "url(#arrowhead-straight)");
          }
        }
      });
      
      // Update link label positions with improved placement
      linkLabels.attr("transform", (d: any) => {
        if (!d.source || !d.target || d.source.x === undefined || d.target.x === undefined) {
          return "translate(0,0)";
        }
        
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        
        // Self-referential loop detection
        const isSelfLoop = d.source.id === d.target.id;
        
        if (isSelfLoop) {
          // Position the label above the loop
          const loopSize = nodeRadius * 1.5;
          return `translate(${sourceX + loopSize * 0.5},${sourceY - loopSize * 0.8})`;
        }
        
        // Calculate the direction angle
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Position the label at the midpoint of the visible line
        const sourceEdgeX = sourceX + Math.cos(angle) * nodeRadius;
        const sourceEdgeY = sourceY + Math.sin(angle) * nodeRadius;
        const targetEdgeX = targetX - Math.cos(angle) * nodeRadius;
        const targetEdgeY = targetY - Math.sin(angle) * nodeRadius;
        
        // Check if there are bidirectional edges
        const isBidirectional = edges.some((otherEdge: any) => 
          (otherEdge.source.id === d.target.id && otherEdge.target.id === d.source.id) ||
          (otherEdge !== d && otherEdge.source.id === d.source.id && otherEdge.target.id === d.target.id)
        );
        
        let labelX;
        let labelY;
        
        if (isBidirectional || distance < nodeRadius * 4) {
          // For bidirectional or close nodes, position label with offset from the midpoint
          const curvature = distance < nodeRadius * 3 ? 0.4 : 0.2;
          const midX = (sourceEdgeX + targetEdgeX) / 2;
          const midY = (sourceEdgeY + targetEdgeY) / 2;
          
          // For curved edges, place label at the apex of curve
          const perpAngle = angle + Math.PI / 2;
          const curveOffset = distance * curvature;
          labelX = midX + Math.cos(perpAngle) * curveOffset;
          labelY = midY + Math.sin(perpAngle) * curveOffset;
        } else {
          // For straight lines, position at midpoint with small offset
          const midX = (sourceEdgeX + targetEdgeX) / 2;
          const midY = (sourceEdgeY + targetEdgeY) / 2;
          
          // Offset to avoid overlapping with the line
          const perpAngle = angle + Math.PI / 2;
          const offset = 15; // Smaller offset for straight lines
          labelX = midX + Math.cos(perpAngle) * offset;
          labelY = midY + Math.sin(perpAngle) * offset;
        }
        
        return `translate(${labelX},${labelY})`;
      });
      
      // Update node positions
      nodeGroups.attr("transform", (d: any) => {
        const x = d.x || 0;
        const y = d.y || 0;
        return `translate(${x},${y})`;
      });
    }
    
    // Run the simulation for more iterations to position nodes before first render
    for (let i = 0; i < 120; i++) {
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
    
    // Key fix: Modify the drag functions to prevent propagation and allow individual node dragging
    function dragstarted(event: d3.D3DragEvent<SVGGElement, any, any>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      
      // Fix only the dragged node's position
      if (event.subject) {
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      // Critical fix: Stop propagation to prevent the zoom behavior from interfering
      if (event.sourceEvent) {
        event.sourceEvent.stopPropagation();
      }
    }
    
    function dragged(event: d3.D3DragEvent<SVGGElement, any, any>) {
      // Update only the dragged node's position
      if (event.subject) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      // Update the graph immediately to show the node movement in real-time
      updatePositions();
      
      // Critical fix: Stop propagation to prevent the zoom behavior from interfering
      if (event.sourceEvent) {
        event.sourceEvent.stopPropagation();
      }
    }
    
    function dragended(event: d3.D3DragEvent<SVGGElement, any, any>) {
      if (!event.active) simulation.alphaTarget(0);
      
      // Keep the node position fixed where it was dropped
      // Do NOT reset fx/fy to null - this would make the node float back
      
      // Critical fix: Stop propagation to prevent the zoom behavior from interfering
      if (event.sourceEvent) {
        event.sourceEvent.stopPropagation();
      }
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
    
  }, [svgRef, nodes, edges, height, darkMode, colorScale]);

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
