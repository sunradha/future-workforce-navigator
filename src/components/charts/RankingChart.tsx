
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface RankingChartProps {
  data: Array<{
    name: string;
    value: number;
    originalValue?: number;
  }>;
  height?: number;
}

const RankingChart: React.FC<RankingChartProps> = ({ data, height = 350 }) => {
  // Transform data for proper display
  const transformedData = data.map(item => ({
    name: item.name,
    value: typeof item.originalValue === 'number' ? Math.round(item.originalValue * 100) : item.value,
    displayValue: item.value
  }));
  
  // Format percentage values for axis
  const formatPercentage = (value: number): string => {
    return `${value}%`;
  };

  // Format tooltip percentage 
  const formatTooltipPercentage = (value: number): string => {
    return `${value.toFixed(0)}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart 
        data={transformedData}
        layout="horizontal"
        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        barSize={20}
      >
        <XAxis 
          type="number"
          domain={[0, 100]}
          ticks={[0, 20, 40, 60, 80, 100]}
          tickFormatter={formatPercentage}
          tick={{ fontSize: 10 }}
        />
        <YAxis 
          dataKey="name"
          type="category"
          width={80}
          tick={{ fontSize: 10 }}
        />
        <Tooltip 
          formatter={(value: number) => [formatTooltipPercentage(value), "Automation Risk"]}
          contentStyle={{ fontSize: '12px' }}
        />
        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />
        <Bar 
          dataKey="value" 
          fill="#8B5CF6" 
          name="Automation Risk"
          background={{ fill: '#f3f4f6' }}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RankingChart;
