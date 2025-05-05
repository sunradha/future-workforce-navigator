
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { formatYAxisTick } from './utils/chartUtils';

interface BarChartProps {
  data: any[];
  colors: string[];
  showLegend?: boolean;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  colors,
  showLegend = true,
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart 
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 35 }}
        layout="vertical"
      >
        <XAxis 
          type="number"
          tick={{ fontSize: 10 }}
          tickFormatter={formatYAxisTick}
        />
        <YAxis 
          dataKey="name" 
          type="category"
          width={120}
          tick={{ fontSize: 10 }}
        />
        <Tooltip contentStyle={{ fontSize: '12px' }} />
        {showLegend && <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />}
        <Bar 
          dataKey="value" 
          fill={colors[0]} 
          maxBarSize={30}
          minPointSize={2}
        >
          {data.map((entry: any, index: number) => (
            <Cell 
              key={`cell-${index}`} 
              fill={('color' in entry && entry.color) ? entry.color : colors[index % colors.length]} 
            />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
