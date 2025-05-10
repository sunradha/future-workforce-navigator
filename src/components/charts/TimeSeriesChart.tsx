
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

// Define interfaces for the different data formats
interface TimeSeriesPoint {
  year: string;
  sector: string;
  value: number;
}

interface TimeSeriesAPIData {
  x: string[];
  y: number[];
}

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[] | TimeSeriesAPIData;
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

  // Transform the data if it's not in the expected format
  const chartData = React.useMemo(() => {
    // If data is already in the correct array format with objects
    if (Array.isArray(data) && data.length > 0 && 'year' in data[0] && 'sector' in data[0] && 'value' in data[0]) {
      return data as TimeSeriesPoint[];
    }

    // Handle the case where data is in the format from the API with x and y arrays
    if (!Array.isArray(data) && 'x' in data && Array.isArray(data.x) && 'y' in data && Array.isArray(data.y)) {
      // Create transformed data points combining x and y values
      return data.x.map((xValue, index) => ({
        year: xValue,
        sector: 'Total',
        value: data.y[index]
      })) as TimeSeriesPoint[];
    }
    
    console.error("Unsupported data format for TimeSeriesChart:", data);
    return [] as TimeSeriesPoint[];
  }, [data]);
  
  console.log("Processed chart data:", chartData);

  // Group data by sector to create multiple lines
  const sectors = [...new Set(chartData.map(item => item.sector))];
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={chartData}
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
            key={`${sector}-${index}`}
            type="monotone"
            dataKey="value"
            data={chartData.filter(item => item.sector === sector)}
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
