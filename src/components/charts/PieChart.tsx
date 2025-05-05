
import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PieChartProps {
  data: any[];
  colors: string[];
  showLegend?: boolean;
  height?: number;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  colors,
  showLegend = true,
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
        >
          {data.map((entry: any, index: number) => (
            <Cell 
              key={`cell-${index}`} 
              fill={('color' in entry && entry.color) ? entry.color : colors[index % colors.length]} 
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} contentStyle={{ fontSize: '12px' }} />
        {showLegend && <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
