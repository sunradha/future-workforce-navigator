
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
  type: 'bar' | 'pie' | 'time_series' | 'ranking' | 'comparative_bar';
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

    // Handle comparative_bar chart data format (categories and series)
    if (apiData && apiData.categories && apiData.series && type === 'comparative_bar') {
      // Filter out null values and transform the data
      return apiData.categories
        .map((category: string, index: number) => {
          if (!category) return null; // Skip null categories
          
          const item: any = { name: category };
          
          // Add data from each series
          apiData.series.forEach((series: any) => {
            if (series.name && series.data && index < series.data.length) {
              item[series.name] = series.data[index];
            }
          });
          
          return item;
        })
        .filter(Boolean); // Remove null entries
    }

    // Handle ranking chart data format (labels and y arrays)
    if (apiData && apiData.labels && apiData.y && type === 'ranking') {
      return apiData.labels.map((label: string, index: number) => {
        const value = apiData.y[index] || 0;
        return {
          name: label || `Item ${index + 1}`,
          value: Math.round(value * 100), // Convert 0.72 to 72 for display
          // Store the original decimal value (0.72) for tooltip
          originalValue: value
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
    return `${value}%`;
  };

  // Calculate the appropriate left margin for ranking charts to accommodate labels
  const getMargin = () => {
    if (type === 'ranking') {
      // Minimal left margin to show more of the bars
      return { top: 5, right: 30, left: 5, bottom: 5 };
    } else if (type === 'comparative_bar') {
      return { top: 10, right: 30, left: 0, bottom: 100 }; 
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
                  hide={true} // Hide the axis to allow more space for bars
                />
                <Tooltip 
                  formatter={(value, name, props) => {
                    // Display original value as percentage
                    const item = chartData.find((item: any) => item.value === value);
                    const originalValue = item?.originalValue ?? (value / 100);
                    return [`${(originalValue * 100).toFixed(0)}%`, "Automation Risk"];
                  }}
                  labelFormatter={(label) => {
                    // Find the entry with this name to display in tooltip
                    const entry = chartData.find((item: any) => item.name === label);
                    return entry ? entry.name : label;
                  }}
                  contentStyle={{ fontSize: '12px' }}
                />
                {showLegend && <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />}
                <Bar 
                  dataKey="value" 
                  fill="#8B5CF6" 
                  name="Automation Risk"
                  background={{ fill: '#f3f4f6' }}
                  barSize={16}
                  isAnimationActive={false} // Disable animation
                  label={(props) => {
                    const { x, y, width, height, value, name } = props;
                    // Position label to the left of the bar
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
              </RechartsBarChart>
            ) : type === 'comparative_bar' ? (
              <RechartsBarChart 
                data={chartData}
                margin={getMargin()}
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
                {/* Dynamically render bars for each series */}
                {data.series && Array.isArray(data.series) && data.series.map((series: any, index: number) => (
                  <Bar 
                    key={`series-${index}`}
                    dataKey={series.name} 
                    fill={colors[index % colors.length]} 
                    name={series.name}
                    maxBarSize={30}
                  />
                ))}
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
