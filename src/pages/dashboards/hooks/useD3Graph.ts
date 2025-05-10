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
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Create a color scale for node types
    const colorScale = d3.scaleOrdinal()
      .domain(['entity', 'employee', 'occupation', 'industry', 'training', 'reskilling_case', 'reskilling_event'])
      .range(['#8B5CF6', '#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#EC4899', '#F97316']);

    // Create the simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(edges)
        .id((d: any) => d.id)
        .distance(150))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(80));

    // Draw the links
    const link = g.append("g")
      .selectAll("path")
      .data(edges)
      .enter()
      .append("path")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
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
      .attr("fill", "white")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("opacity", 0.8);

    // Add text for link labels
    const linkText = linkLabels.append("text")
      .text(d => formatRelationship(d.relationship))
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("pointer-events", "none")
      .attr("fill", "#333");

    // Size the rectangles based on text content
    linkLabels.selectAll("text").each(function(this: SVGTextElement) {
      const bbox = this.getBBox();
      const parent = d3.select(this.parentNode as any);
      parent.select("rect")
        .attr("x", bbox.x - 4)
        .attr("y", bbox.y - 2)
        .attr("width", bbox.width + 8)
        .attr("height", bbox.height + 4);
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

    // Add node circles
    nodeGroups.append("circle")
      .attr("r", 40)
      .attr("fill", d => colorScale(d.type || 'entity'))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add node labels
    nodeGroups.append("text")
      .text(d => formatLabel(d.label))
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#fff")
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
        const firstWords = words.slice(0, 2).join(' ');
        const remainingWords = words.slice(2).join(' ');
        
        text.append("tspan")
          .attr("x", 0)
          .attr("y", "-0.6em")
          .text(firstWords);
          
        if (remainingWords) {
          text.append("tspan")
            .attr("x", 0)
            .attr("y", "0.6em")
            .text(remainingWords.length > 12 ? 
                remainingWords.substring(0, 10) + "..." : 
                remainingWords);
        }
      });

    // Add tooltips
    nodeGroups.append("title")
      .text(d => `${d.label} (${d.type || 'Entity'})`);

    // Update positions on tick
    simulation.on("tick", () => {
      // Constrain nodes to the SVG bounds
      nodes.forEach(node => {
        node.x = Math.max(40, Math.min(width - 40, node.x || width/2));
        node.y = Math.max(40, Math.min(height - 40, node.y || height/2));
      });
      
      // Update link positions
      link.attr("d", (d: any) => {
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
      });
      
      // Update link label positions
      linkLabels.attr("transform", (d: any) => {
        const x = (d.source.x + d.target.x) / 2;
        const y = (d.source.y + d.target.y) / 2;
        return `translate(${x},${y - 15})`;
      });
      
      // Update node positions
      nodeGroups.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
    
    // Auto-center the graph initially
    setTimeout(() => {
      svg.call(zoom.transform as any, 
        d3.zoomIdentity
          .translate(width/2, height/2)
          .scale(0.7)
          .translate(-width/2, -height/2)
      );
    }, 100);
    
    // Drag functions
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
      // Keep positions fixed after dragging for better UX
      // event.subject.fx = null;
      // event.subject.fy = null;
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
      
      return formatted.length > 12 ? 
        formatted.substring(0, 10) + "..." : 
        formatted;
    }
  }, [svgRef, nodes, edges, height]);

  useEffect(() => {
    renderGraph();
    
    // Add resize listener
    const handleResize = () => renderGraph();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderGraph]);
};
