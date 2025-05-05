
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
  
  const formatPercentage = (value: number): string => {
    return `${value}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart 
        data={transformedData}
        layout="horizontal"
        margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
        barGap={0}
        barCategoryGap={1}
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
          hide={true} // Hide to allow more space for bars
        />
        <Tooltip 
          formatter={(value) => [`${value}%`, "Automation Risk"]}
          labelFormatter={(label) => {
            // Find the entry with this name to display in tooltip
            const entry = transformedData.find(item => item.name === label);
            return entry ? entry.name : label;
          }}
          contentStyle={{ fontSize: '12px' }}
        />
        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />
        <Bar 
          dataKey="value" 
          fill="#8B5CF6" 
          name="Automation Risk"
          background={{ fill: '#f3f4f6' }}
          barSize={16}
          isAnimationActive={false}
          label={(props) => {
            const { x, y, width, height, value, name } = props;
            return (
              <text 
                x={x - 5} 
                y={y + height / 2} 
                dy={4}
                textAnchor="end"
                fontSize={10}
              >
                {name}
              </text>
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RankingChart;
