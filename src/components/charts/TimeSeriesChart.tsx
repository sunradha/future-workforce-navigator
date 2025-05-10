
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { formatYAxisTick } from './utils/chartUtils';

interface TimeSeriesChartProps {
  data: any[];
  colors: string[];
  showLegend?: boolean;
  height?: number;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  colors,
  showLegend = true,
  height = 300,
}) => {
  console.log("TimeSeriesChart rendering with data:", data);

  // Group data by sector to create multiple lines
  const sectors = [...new Set(data.map(item => item.sector))];
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 35 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="year"
          angle={0}
          textAnchor="middle"
          height={60}
          tick={{ fontSize: 10 }}
          tickMargin={8}
        />
        <YAxis
          width={70}
          tick={{ fontSize: 10 }}
          tickFormatter={formatYAxisTick}
          label={{ value: 'Investment (£)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '10px' } }}
        />
        <Tooltip contentStyle={{ fontSize: '12px' }} formatter={(value: number) => [`£${value.toLocaleString()}`, 'Investment']} />
        {showLegend && <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />}
        
        {sectors.map((sector, index) => (
          <Line
            key={sector}
            type="monotone"
            dataKey="value"
            data={data.filter(item => item.sector === sector)}
            name={sector}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 3, fill: colors[index % colors.length] }}
            activeDot={{ r: 5, fill: colors[index % colors.length] }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesChart;
