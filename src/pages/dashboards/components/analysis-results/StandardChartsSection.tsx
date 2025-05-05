
import React from 'react';
import { ProcessMiningResponse } from '@/services/ProcessMiningService';
import ProcessGraph from '../ProcessGraph';
import ChartCard from '@/components/ChartCard';
import { Route } from 'lucide-react';

interface StandardChartsSectionProps {
  results: ProcessMiningResponse;
}

const StandardChartsSection: React.FC<StandardChartsSectionProps> = ({ results }) => {
  if (!results?.result) return null;
  
  // Check if there's chart data to display
  const hasStandardChartData = results.result.chart && 
    results.result.chart.data &&
    !['knowledge_graph', 'causal_graph', 'time_series', 'ranking', 'comparative_bar'].includes(results.result.chart.type || '');

  // Check if there's time series data to display
  const hasTimeSeriesChart = results.result.chart && 
    results.result.chart.type === 'time_series' && 
    results.result.chart.data;
    
  // Check if there's ranking data to display
  const hasRankingChart = results.result.chart && 
    results.result.chart.type === 'ranking' && 
    results.result.chart.data;
    
  // Check if there's comparative bar chart data
  const hasComparativeBarChart = results.result.chart &&
    results.result.chart.type === 'comparative_bar' &&
    results.result.chart.data;
    
  const hasAnyChart = hasStandardChartData || hasTimeSeriesChart || hasRankingChart || hasComparativeBarChart;
  const hasKnowledgeGraph = results.result.chart && 
    ['knowledge_graph', 'causal_graph'].includes(results.result.chart.type || '') && 
    results.result.chart.data;

  // If we have a knowledge graph or no charts at all, don't render this section
  if (hasKnowledgeGraph || !hasAnyChart) return null;

  return (
    <div className="grid gap-3 grid-cols-1">
      {/* Process Graph */}
      {results.result.graph && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm w-full">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Route className="h-4 w-4 text-blue-500" />
            Process Graph
          </h3>
          <ProcessGraph graphData={results.result.graph} />
        </div>
      )}
      
      {/* Standard Charts */}
      {hasStandardChartData && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm w-full">
          <ChartCard
            title="Analysis Chart"
            subtitle="Visualized insights"
            type={results.result.chart.type === 'pie' ? 'pie' : 'bar'}
            data={results.result.chart.data}
            height={350}
            className="w-full"
          />
        </div>
      )}

      {/* Time Series Chart */}
      {hasTimeSeriesChart && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm w-full">
          <ChartCard
            title="Time Series Analysis"
            subtitle="Trends over time"
            type="time_series"
            data={results.result.chart.data}
            height={350}
            className="w-full"
          />
        </div>
      )}
      
      {/* Ranking Chart */}
      {hasRankingChart && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm w-full">
          <ChartCard
            title="Automation Risk by Area"
            subtitle="Areas ranked by automation probability"
            type="ranking"
            data={results.result.chart.data}
            height={550}
            className="w-full"
          />
        </div>
      )}
      
      {/* Comparative Bar Chart */}
      {hasComparativeBarChart && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm w-full">
          <ChartCard
            title="Comparative Analysis"
            subtitle="Training programs difficulty comparison"
            type="comparative_bar"
            data={results.result.chart.data}
            height={550}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default StandardChartsSection;
