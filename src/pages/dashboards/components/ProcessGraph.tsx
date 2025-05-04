
import React from 'react';

interface ProcessGraphProps {
  graphData: string;
}

const ProcessGraph = ({ graphData }: ProcessGraphProps) => {
  return (
    <div className="overflow-x-auto w-full">
      <img 
        src={`data:image/png;base64,${graphData}`}
        alt="Process Mining Graph"
        className="w-full h-auto object-contain"
      />
    </div>
  );
};

export default ProcessGraph;
