
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  BarChart as RechartsBarChart,
  Cell,
  Legend,
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
  type: 'bar' | 'pie';
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
  const transformApiData = (apiData: any): ChartData => {
    // If data is already in the expected format, return it
    if (Array.isArray(apiData)) {
      return apiData;
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
              <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 35 }}>
                <XAxis 
                  dataKey="name" 
                  angle={-35}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 10 }}
                  tickMargin={8}
                />
                <YAxis width={40} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: '12px' }} />
                {showLegend && <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />}
                <Bar dataKey="value" fill={colors[0]}>
                  {chartData.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={('color' in entry && entry.color) ? entry.color : colors[index % colors.length]} 
                    />
                  ))}
                </Bar>
              </RechartsBarChart>
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
