
import React, { useMemo } from 'react';
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

interface MultiSeriesTimeSeriesChartProps {
  data: any[];
  colors: string[];
  showLegend?: boolean;
  height?: number;
}

const MultiSeriesTimeSeriesChart: React.FC<MultiSeriesTimeSeriesChartProps> = ({
  data,
  colors,
  showLegend = true,
  height = 300,
}) => {
  console.log("MultiSeriesTimeSeriesChart rendering with data:", data);

  // Extract all series keys (excluding 'x' which is the time dimension)
  const seriesKeys = useMemo(() => {
    if (!data.length) return [];
    
    // Get all keys from the first data point excluding 'x'
    const firstItem = data[0];
    return Object.keys(firstItem).filter(key => key !== 'x' && key !== 'Total');
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 35 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="x"
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
        <Tooltip 
          contentStyle={{ fontSize: '12px' }} 
          formatter={(value: number) => [`£${value.toLocaleString()}`, 'Investment']} 
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />}
        
        {seriesKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={key}
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

export default MultiSeriesTimeSeriesChart;
