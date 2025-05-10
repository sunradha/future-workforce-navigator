
import React from 'react';

interface ProcessGraphProps {
  graphData: string;
  title?: string;
}

const ProcessGraph = ({ graphData, title }: ProcessGraphProps) => {
  // Check if the graphData is a base64 image or JSON string with nodes and edges
  const isBase64 = !graphData.includes('{');
  
  return (
    <div className="overflow-x-auto w-full">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      {isBase64 ? (
        <img 
          src={`data:image/png;base64,${graphData}`}
          alt="Process Mining Graph"
          className="w-full h-auto object-contain"
        />
      ) : (
        // For process_flow and other node/edge type visualizations
        <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
          <pre className="text-xs overflow-auto max-h-[500px]">
            {JSON.stringify(JSON.parse(graphData), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ProcessGraph;
