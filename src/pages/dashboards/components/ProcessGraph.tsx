
import React from 'react';
import { Network } from 'lucide-react';

interface ProcessGraphProps {
  graphData: string;
  title?: string;
}

const ProcessGraph = ({ graphData, title }: ProcessGraphProps) => {
  const parsedData = JSON.parse(graphData);
  const nodes = parsedData.nodes || [];
  const edges = parsedData.edges || [];
  
  return (
    <div className="w-full h-full p-5 bg-gray-900 rounded-lg border border-gray-800 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium flex items-center gap-2 text-green-400">
          <Network className="h-5 w-5" />
          {title || "Process Flow"}
        </h3>
        <span className="text-xs text-gray-400">
          {nodes.length} nodes • {edges.length} connections
        </span>
      </div>
      
      <div className="w-full overflow-hidden rounded-md bg-gray-800 p-4" style={{ minHeight: "400px" }}>
        <pre className="text-xs overflow-auto max-h-[500px] text-gray-200">
          {JSON.stringify(parsedData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ProcessGraph;
