
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
  // Transform the data to ensure values are properly displayed as percentages
  const transformedData = data.map(item => ({
    name: item.name,
    value: typeof item.value === 'number' 
      // If the value is a decimal (like 0.53), convert to percentage (53)
      ? (item.value < 1 ? Math.round(item.value * 100) : item.value)
  }));

  console.log('RankingChart rendering with transformedData:', transformedData);

  // Custom tooltip to display percentages
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded text-xs">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p>{`Automation Risk: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Format X-axis ticks as percentages
  const formatXAxis = (value: number) => `${value}%`;

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
          domain={[0, 100]} 
          tickFormatter={formatXAxis}
          ticks={[0, 20, 40, 60, 80, 100]}
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
