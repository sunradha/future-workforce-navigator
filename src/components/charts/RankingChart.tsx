
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
          <p>{`Value: ${payload[0].value}`}</p>
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
        barSize={20}
      >
        <XAxis 
          type="number" 
          domain={[0, 'dataMax']}
          tickFormatter={(value) => value.toString()}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          width={120}
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          fill={barColor}
          background={{ fill: '#f3f4f6' }}
          radius={[0, 0, 0, 0]}
        >
          <LabelList 
            dataKey="value" 
            position="right" 
            style={{ fill: "#333", fontSize: 12, fontWeight: 500 }}
            formatter={(value: number) => value.toFixed(2)}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RankingChart;
