
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartData, BarData } from '@/types';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import TimeSeriesChart from './charts/TimeSeriesChart';
import ComparativeBarChart from './charts/ComparativeBarChart';
import RankingChart from './charts/RankingChart';
import { transformApiData } from './charts/utils/chartUtils';

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
  // Transform the data if needed
  const chartData = transformApiData(data, type);

  console.log("ChartCard rendering with type:", type, "and data:", chartData);

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

  // Extract series names for comparative bar chart
  let seriesNames: string[] = [];
  if (type === 'comparative_bar' && data.series) {
    seriesNames = data.series.map((series: any) => series.name);
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2 px-3 py-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent className="p-0 w-full">
        <div style={{ width: '100%', height }} className="w-full">
          {type === 'bar' && (
            <BarChart 
              data={chartData} 
              colors={colors} 
              showLegend={showLegend} 
              height={height} 
            />
          )}

          {type === 'pie' && (
            <PieChart 
              data={chartData} 
              colors={colors} 
              showLegend={showLegend} 
              height={height} 
            />
          )}

          {type === 'time_series' && (
            <TimeSeriesChart 
              data={chartData} 
              colors={colors} 
              showLegend={showLegend} 
              height={height} 
            />
          )}

          {type === 'comparative_bar' && (
            <ComparativeBarChart 
              data={chartData} 
              colors={colors} 
              seriesNames={seriesNames}
              showLegend={showLegend} 
              height={height} 
            />
          )}

          {type === 'ranking' && (
            <RankingChart 
              data={chartData}
              height={height} 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
