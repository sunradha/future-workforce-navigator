
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
}

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#6366f1'];

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  type,
  data,
  colors = COLORS,
  showLegend = true,
  height = 300,
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
      })).filter((item: any, index: number) => index > 0 || item.name !== 'null');
    }

    // Fallback for empty or invalid data
    return [];
  };

  // Transform the data if needed
  const chartData = transformApiData(data);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                {showLegend && <Legend />}
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
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                {showLegend && <Legend />}
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
