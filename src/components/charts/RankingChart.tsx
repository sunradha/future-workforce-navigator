
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

interface RankingChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  height?: number;
  barColor?: string;
}

const RankingChart: React.FC<RankingChartProps> = ({ 
  data, 
  height = 350, 
  barColor = "#8B5CF6" 
}) => {
  // Make sure we have data and sort it by value (ascending for better visibility)
  if (!data || data.length === 0) {
    console.warn('RankingChart received no data');
    return <div className="h-40 flex items-center justify-center">No data available</div>;
  }

  console.log('RankingChart rendering with data:', data);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded text-xs">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p>{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
      >
        <XAxis 
          type="number" 
          domain={[0, 'dataMax']}
          tickFormatter={(value) => value.toString()}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          width={150}
          tick={{ fontSize: 11 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          fill={barColor}
          background={{ fill: '#f3f4f6' }}
        >
          <LabelList 
            dataKey="value" 
            position="right" 
            style={{ fill: "#333", fontSize: 11, fontWeight: 500 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RankingChart;
