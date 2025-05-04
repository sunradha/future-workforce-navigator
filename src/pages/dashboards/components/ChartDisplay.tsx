
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ChartBar, ChartPie } from 'lucide-react';
import { GraphData } from '@/services/ProcessMiningService';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';

interface ChartDisplayProps {
  chartData: GraphData;
}

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#6366f1'];

const ChartDisplay = ({ chartData }: ChartDisplayProps) => {
  const renderChart = () => {
    switch (chartData.type) {
      case 'ranking':
        return renderRankingChart();
      case 'pie':
        return renderPieChart();
      case 'time_series':
        return renderTimeSeriesChart();
      case 'comparative_bar':
        return renderComparativeBarChart();
      case 'histogram':
        return renderHistogram();
      case 'knowledge_graph':
      case 'causal_graph':
      case 'process_flow':
        return renderGraphVisualization();
      case 'table':
        return renderTable();
      default:
        return <p>Unsupported chart type: {chartData.type}</p>;
    }
  };

  const renderRankingChart = () => {
    const data = chartData.data.labels?.map((label: string, index: number) => ({
      name: label,
      value: chartData.data.y[index]
    })) || [];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={70} 
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = () => {
    const data = chartData.data.labels?.map((label: string, index: number) => ({
      name: label,
      value: chartData.data.values[index]
    })) || [];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderTimeSeriesChart = () => {
    const data = chartData.data.x?.map((date: string, index: number) => ({
      date,
      value: chartData.data.y[index]
    })) || [];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderComparativeBarChart = () => {
    if (!chartData.data.categories || !chartData.data.series) {
      return <p>No data available for comparative bar chart</p>;
    }

    const data = chartData.data.categories.map((category: string, idx: number) => {
      const item: any = { name: category };
      chartData.data.series.forEach((series: any) => {
        item[series.name] = series.data[idx];
      });
      return item;
    });

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={70} 
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {chartData.data.series.map((series: any, index: number) => (
            <Bar 
              key={`bar-${index}`}
              dataKey={series.name} 
              fill={COLORS[index % COLORS.length]} 
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderHistogram = () => {
    // A simple histogram can be represented as a bar chart
    const data = chartData.data.values.map((value: number, index: number) => ({
      bin: `Bin ${index + 1}`,
      count: value
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bin" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderGraphVisualization = () => {
    // For complex graph visualizations, we'll just show a message
    // A proper implementation would require a graph visualization library
    return <p>Graph visualization is available but requires a specialized visualization library</p>;
  };

  const renderTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {chartData.data[0] && Object.keys(chartData.data[0]).map((header, index) => (
                <th 
                  key={index}
                  className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {chartData.data.map((row: any, rowIndex: number) => (
              <tr key={rowIndex}>
                {Object.values(row).map((cell: any, cellIndex: number) => (
                  <td key={cellIndex} className="px-2 py-1 text-sm text-gray-500">
                    {cell?.toString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getChartIcon = () => {
    switch (chartData.type) {
      case 'pie':
        return <ChartPie className="h-4 w-4" />;
      default:
        return <ChartBar className="h-4 w-4" />;
    }
  };

  const getChartTitle = () => {
    switch (chartData.type) {
      case 'ranking':
        return 'Ranking Chart';
      case 'pie':
        return 'Pie Chart';
      case 'time_series':
        return 'Time Series Chart';
      case 'comparative_bar':
        return 'Comparative Bar Chart';
      case 'histogram':
        return 'Histogram';
      case 'knowledge_graph':
        return 'Knowledge Graph';
      case 'causal_graph':
        return 'Causal Graph';
      case 'process_flow':
        return 'Process Flow';
      case 'table':
        return 'Data Table';
      default:
        return 'Chart';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-1 py-1">
        {getChartIcon()}
        <CardTitle className="text-sm font-medium">{getChartTitle()}</CardTitle>
      </CardHeader>
      <CardContent className="py-1">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default ChartDisplay;
