
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatYAxisTick } from './utils/chartUtils';

interface ComparativeBarChartProps {
  data: any[];
  colors: string[];
  seriesNames: string[];
  showLegend?: boolean;
  height?: number;
}

const ComparativeBarChart: React.FC<ComparativeBarChartProps> = ({
  data,
  colors,
  seriesNames,
  showLegend = true,
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart 
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 100 }}
        layout="vertical"
        barGap={5}
      >
        <XAxis 
          type="number" 
          tick={{ fontSize: 10 }}
          tickFormatter={formatYAxisTick}
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={140}
          tick={{ fontSize: 10 }}
        />
        <Tooltip contentStyle={{ fontSize: '12px' }} />
        {showLegend && <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />}
        {seriesNames.map((seriesName: string, index: number) => (
          <Bar 
            key={`series-${index}`}
            dataKey={seriesName} 
            fill={colors[index % colors.length]} 
            name={seriesName}
            maxBarSize={30}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default ComparativeBarChart;
