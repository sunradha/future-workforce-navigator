
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Image as ImageIcon } from 'lucide-react';

interface ProcessGraphProps {
  graphData: string;
}

const ProcessGraph = ({ graphData }: ProcessGraphProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 py-2">
        <ImageIcon className="h-4 w-4" />
        <CardTitle className="text-sm font-medium">Process Graph</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <img 
          src={`data:image/png;base64,${graphData}`}
          alt="Process Mining Graph"
          className="max-w-full h-auto"
        />
      </CardContent>
    </Card>
  );
};

export default ProcessGraph;
