
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

interface RankingChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  height?: number;
  barColor?: string;
}

const RankingChart: React.FC<RankingChartProps> = ({ 
  data, 
  height = 350, 
  barColor = "#8B5CF6" 
}) => {
  // Make sure we have data and sort it by value (ascending for better visibility)
  if (!data || data.length === 0) {
    console.warn('RankingChart received no data');
    return <div className="h-40 flex items-center justify-center">No data available</div>;
  }

  console.log('RankingChart rendering with data:', data);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded text-xs">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p>{`Value: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tick component for YAxis to handle multi-line text
  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const value = payload.value;
    
    // Split long text into multiple lines
    let lines = [value];
    if (value.length > 30) {
      const words = value.split(' ');
      lines = [];
      let currentLine = '';
      
      words.forEach(word => {
        if ((currentLine + word).length < 30) {
          currentLine += (currentLine ? ' ' : '') + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      });
      
      if (currentLine) {
        lines.push(currentLine);
      }
    }

    return (
      <g transform={`translate(${x},${y})`}>
        {lines.map((line, i) => (
          <text 
            key={i}
            x={-10} 
            y={i * 16} 
            dy={5} 
            textAnchor="end" 
            fill="#666"
            fontSize={12}
          >
            {line}
          </text>
        ))}
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
        barSize={20}
      >
        <XAxis 
          type="number" 
          domain={[0, 1]}
          tickFormatter={(value) => value.toString()}
          tickCount={6}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          width={220}
          tick={<CustomYAxisTick />}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          fill={barColor}
          background={{ fill: '#f3f4f6' }}
          radius={[0, 0, 0, 0]}
        >
          <LabelList 
            dataKey="value" 
            position="right" 
            style={{ fill: "#333", fontSize: 12, fontWeight: 500 }}
            formatter={(value: number) => value.toFixed(2)}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RankingChart;
