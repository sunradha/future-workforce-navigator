
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RankingChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  height?: number;
}

const RankingChart: React.FC<RankingChartProps> = ({ data, height = 350 }) => {
  // Transform the data to ensure values are properly displayed
  const transformedData = data.map(item => ({
    name: item.name,
    value: typeof item.value === 'number' 
      ? (item.value < 1 ? Math.round(item.value * 100) : item.value)
      : 0
  }));

  console.log('RankingChart rendering with transformedData:', transformedData);

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
        data={transformedData}
        layout="horizontal"
        margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
        barSize={20}
      >
        <XAxis 
          type="number" 
          domain={[0, 'dataMax']} 
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          width={80}
          tick={{ fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          fill="#8B5CF6"
          background={{ fill: '#f3f4f6' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RankingChart;
