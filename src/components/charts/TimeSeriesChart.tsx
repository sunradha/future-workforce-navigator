
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 35 }}
      >
        <XAxis
          dataKey="name"
          angle={0}
          textAnchor="middle"
          height={60}
          tick={{ fontSize: 10 }}
          tickMargin={8}
        />
        <YAxis
          width={50}
          tick={{ fontSize: 10 }}
          tickFormatter={formatYAxisTick}
        />
        <Tooltip contentStyle={{ fontSize: '12px' }} />
        {showLegend && <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />}
        <Line
          type="monotone"
          dataKey="value"
          stroke={colors[0]}
          strokeWidth={2}
          dot={{ r: 4, fill: colors[0] }}
          activeDot={{ r: 6, fill: colors[0] }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesChart;
