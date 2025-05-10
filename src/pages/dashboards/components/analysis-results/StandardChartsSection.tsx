
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
    !['knowledge_graph', 'causal_graph', 'time_series', 'multi-series_time_series_chart', 'ranking', 'comparative_bar', 'process_flow'].includes(results.result.chart.type || '');

  // Check if there's time series data to display
  const hasTimeSeriesChart = results.result.chart && 
    results.result.chart.type === 'time_series' && 
    results.result.chart.data;
    
  // Check if there's multi-series time series data to display
  const hasMultiSeriesTimeSeriesChart = results.result.chart && 
    results.result.chart.type === 'multi-series_time_series_chart' && 
    results.result.chart.data;
    
  // Check if there's ranking data to display
  const hasRankingChart = results.result.chart && 
    results.result.chart.type === 'ranking' && 
    results.result.chart.data;
    
  // Check if there's comparative bar chart data
  const hasComparativeBarChart = results.result.chart &&
    results.result.chart.type === 'comparative_bar' &&
    results.result.chart.data;
  
  // Check if there's process flow data to display
  const hasProcessFlowChart = results.result.chart && 
    results.result.chart.type === 'process_flow' && 
    results.result.chart.data;
    
  const hasAnyChart = hasStandardChartData || hasTimeSeriesChart || hasRankingChart || hasComparativeBarChart || hasMultiSeriesTimeSeriesChart || hasProcessFlowChart;
  const hasKnowledgeGraph = results.result.chart && 
    ['knowledge_graph', 'causal_graph'].includes(results.result.chart.type || '') && 
    results.result.chart.data;

  // If we have a knowledge graph or no charts at all, don't render this section
  if (hasKnowledgeGraph || !hasAnyChart) return null;
  
  console.log("Chart data type:", results.result.chart?.type);
  console.log("Chart data:", results.result.chart?.data);

  // Determine title and subtitle based on chart type or query content
  const getRankingChartTitle = () => {
    // Use results.result.reasoning_answer instead of the non-existent process_mining_result
    const query = results.result.reasoning_answer?.toLowerCase() || '';
    
    if (query.includes('automation risk') || query.includes('risk of automation')) {
      return {
        title: "Automation Risk by Occupation",
        subtitle: "Occupations ranked by automation probability"
      };
    }
    
    if (query.includes('skill categories') && query.includes('difficulty')) {
      return {
        title: "Skill Categories with High-Difficulty Programs",
        subtitle: "Categories ranked by number of difficult training programs"
      };
    }
    
    // Default title
    return {
      title: "Ranking Analysis",
      subtitle: "Items ranked by value"
    };
  };
  
  // Function to determine title and subtitle for time series charts
  const getTimeSeriesChartTitle = () => {
    const query = results.result.reasoning_answer?.toLowerCase() || '';
    
    if (query.includes('training budgets') || query.includes('investment')) {
      return {
        title: "Training Investment Trends",
        subtitle: "Investment in training programs over time by sector"
      };
    }
    
    if (query.includes('completion time') || query.includes('time taken')) {
      return {
        title: "Training Program Completion Time",
        subtitle: "Average time to complete programs over years"
      };
    }
    
    // Default title
    return {
      title: "Time Series Analysis",
      subtitle: "Trends over time"
    };
  };
  
  // Function to determine title and subtitle for multi-series time series charts
  const getMultiSeriesTimeSeriesChartTitle = () => {
    const query = results.result.reasoning_answer?.toLowerCase() || '';
    
    if (query.includes('training budgets') || query.includes('investment')) {
      return {
        title: "Training Investment Trends by Sector (2011-2022)",
        subtitle: "Sector investment comparison over time"
      };
    }
    
    // Default title
    return {
      title: "Multi-Series Time Analysis",
      subtitle: "Multiple trends over time"
    };
  };

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
            title={getTimeSeriesChartTitle().title}
            subtitle={getTimeSeriesChartTitle().subtitle}
            type="time_series"
            data={results.result.chart.data}
            height={400}
            className="w-full"
          />
        </div>
      )}
      
      {/* Multi-Series Time Series Chart */}
      {hasMultiSeriesTimeSeriesChart && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm w-full">
          <ChartCard
            title={getMultiSeriesTimeSeriesChartTitle().title}
            subtitle={getMultiSeriesTimeSeriesChartTitle().subtitle}
            type="multi-series_time_series_chart"
            data={results.result.chart.data}
            height={400}
            className="w-full"
          />
        </div>
      )}
      
      {/* Process Flow Chart */}
      {hasProcessFlowChart && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm w-full">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Route className="h-4 w-4 text-green-500" />
            Process Flow
          </h3>
          <ProcessGraph 
            graphData={results.result.chart.data.nodes && results.result.chart.data.edges ? 
              JSON.stringify({ nodes: results.result.chart.data.nodes, edges: results.result.chart.data.edges }) : 
              JSON.stringify(results.result.chart.data)
            } 
            title="Process Flow"
          />
        </div>
      )}
      
      {/* Ranking Chart */}
      {hasRankingChart && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm w-full">
          <ChartCard
            title={getRankingChartTitle().title}
            subtitle={getRankingChartTitle().subtitle}
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
