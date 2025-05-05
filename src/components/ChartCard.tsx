import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  BarChart as RechartsBarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartData, BarData } from '@/types';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  type: 'bar' | 'pie' | 'time_series' | 'ranking';
  data: ChartData | BarData | any; // Allow for API response format
  colors?: string[];
  showLegend?: boolean;
  height?: number;
  className?: string;
}

const COLORS = ['#8B5CF6', '#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#6366f1'];

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  type,
  data,
  colors = COLORS,
  showLegend = true,
  height = 300,
  className = '',
}) => {
  // Function to transform API chart data to the format expected by recharts
  const transformApiData = (apiData: any): ChartData | any => {
    // If data is already in the expected format, return it
    if (Array.isArray(apiData)) {
      return apiData;
    }

    // Handle ranking chart data format (labels and y arrays)
    if (apiData && apiData.labels && apiData.y && type === 'ranking') {
      return apiData.labels.map((label: string, index: number) => {
        // Multiply values below 1 by 100 for better visibility
        let value = apiData.y[index] || 0;
        if (value < 1) {
          value = value * 100;
        }
        return {
          name: label || `Item ${index + 1}`,
          value: value,
          // Original value for tooltip display
          originalValue: apiData.y[index] || 0
        };
      }).filter((item: any) => item.name !== 'null');
    }

    // Handle time series data format
    if (apiData && apiData.x && apiData.y) {
      // For time series, transform the data into an array of objects
      return apiData.x.map((label: string, index: number) => ({
        name: label,
        value: apiData.y[index] || 0,
      }));
    }

    // Handle the API response format where data has x, y, labels
    if (apiData && apiData.y && apiData.labels) {
      return apiData.labels.map((label: string, index: number) => ({
        name: label || `Item ${index + 1}`,
        value: apiData.y[index] || 0,
      })).filter((item: any) => item.name !== 'null');
    }

    // Fallback for empty or invalid data
    return [];
  };

  // Transform the data if needed
  const chartData = transformApiData(data);

  if (chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground text-sm">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Format Y-axis ticks - ensure it always returns a string
  const formatYAxisTick = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  // Format percentage values for ranking chart
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(0)}%`;
  };

  // Calculate the appropriate left margin for ranking charts to accommodate labels
  const getMargin = () => {
    if (type === 'ranking') {
      // More left margin for job titles but keep the graph position to the left
      return { top: 5, right: 30, left: 170, bottom: 5 };
    }
    return { top: 10, right: 10, left: 0, bottom: 35 };
  };

  console.log("ChartCard rendering with type:", type, "and data:", chartData);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2 px-3 py-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent className="p-0 w-full">
        <div style={{ width: '100%', height }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <RechartsBarChart 
                data={chartData}
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
                  {chartData.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={('color' in entry && entry.color) ? entry.color : colors[index % colors.length]} 
                    />
                  ))}
                </Bar>
              </RechartsBarChart>
            ) : type === 'ranking' ? (
              <RechartsBarChart 
                data={chartData}
                margin={getMargin()}
                layout="horizontal"
                barCategoryGap={5}
              >
                <XAxis 
                  type="number"
                  domain={[0, 'dataMax']}
                  tickFormatter={formatPercentage}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  dataKey="name"
                  type="category"
                  width={165} 
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  formatter={(value, name, props) => {
                    // Use the original value for tooltip display
                    const item = chartData.find(item => item.value === value);
                    const originalValue = item?.originalValue ?? value;
                    return [`${(originalValue * 100).toFixed(0)}%`, "Automation Risk"];
                  }}
                  contentStyle={{ fontSize: '12px' }}
                />
                {showLegend && <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />}
                <Bar 
                  dataKey="value" 
                  fill="#8B5CF6" 
                  name="Automation Risk"
                  maxBarSize={20}
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill="#8B5CF6"  // Using consistent purple color for all bars
                    />
                  ))}
                </Bar>
              </RechartsBarChart>
            ) : type === 'time_series' ? (
              <LineChart
                data={chartData}
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
            ) : (
              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={('color' in entry && entry.color) ? entry.color : colors[index % colors.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} contentStyle={{ fontSize: '12px' }} />
                {showLegend && <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />}
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
