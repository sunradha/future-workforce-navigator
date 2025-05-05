
import React from 'react';

interface ProcessGraphProps {
  graphData: string;
  title?: string;
}

const ProcessGraph = ({ graphData, title }: ProcessGraphProps) => {
  return (
    <div className="overflow-x-auto w-full">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      <img 
        src={`data:image/png;base64,${graphData}`}
        alt="Process Mining Graph"
        className="w-full h-auto object-contain"
      />
    </div>
  );
};

export default ProcessGraph;
