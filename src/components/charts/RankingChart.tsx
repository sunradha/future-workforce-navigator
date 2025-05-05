
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
  // Transform data for proper display - ensure values are properly converted to percentages
  const transformedData = data.map(item => ({
    name: item.name,
    value: item.originalValue ? Math.round(item.originalValue * 100) : Math.round(item.value),
    displayValue: item.value,
    originalValue: item.originalValue
  }));
  
  // Format percentage values for axis
  const formatPercentage = (value: number): string => {
    return `${value}%`;
  };

  // Custom tooltip formatter to show the proper percentage value
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const displayValue = data.originalValue ? Math.round(data.originalValue * 100) : data.value;
      
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-200 shadow-md rounded text-xs">
          <p className="font-semibold">{data.name}</p>
          <p>{`Automation Risk: ${displayValue}%`}</p>
        </div>
      );
    }
    return null;
  };

  console.log("RankingChart rendering with data:", transformedData);

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
        <Tooltip content={<CustomTooltip />} />
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
