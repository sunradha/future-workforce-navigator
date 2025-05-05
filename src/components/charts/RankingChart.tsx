
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
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
  // Transform data for proper display - convert decimal values to percentages (0.54 to 54)
  const transformedData = data.map(item => {
    // Check if we're dealing with decimal values that need to be converted to percentages
    const isDecimal = item.originalValue !== undefined ? 
      item.originalValue < 1 : 
      item.value < 1;
    
    return {
      name: item.name,
      // If value is decimal (like 0.54), multiply by 100 to get percentage (54)
      value: isDecimal ? Math.round((item.originalValue || item.value) * 100) : item.value,
      // Store original value for reference
      originalValue: item.originalValue || item.value
    };
  });
  
  // Format percentage values for axis
  const formatPercentage = (value: number): string => {
    return `${value}%`;
  };

  // Custom tooltip formatter to show the proper percentage value
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-200 shadow-md rounded text-xs">
          <p className="font-semibold">{data.name}</p>
          <p>{`Automation Risk: ${data.value}%`}</p>
        </div>
      );
    }
    return null;
  };

  console.log("RankingChart rendering with transformed data:", transformedData);

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
        >
          {transformedData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`}
              fill="#8B5CF6"
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RankingChart;
