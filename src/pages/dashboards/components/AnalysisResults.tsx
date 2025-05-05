
import React from 'react';
import { ProcessMiningResponse } from '@/services/ProcessMiningService';
import AnalysisCard from './AnalysisCard';
import ProcessGraph from './ProcessGraph';
import ChartCard from '@/components/ChartCard';
import { Route, Code } from 'lucide-react';
import KnowledgeGraph from './KnowledgeGraph';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AnalysisResultsProps {
  results: ProcessMiningResponse;
  visible: boolean;
}

const AnalysisResults = ({ results, visible }: AnalysisResultsProps) => {
  if (!results?.result || !visible) return null;
  
  // Check if there's chart data to display
  const hasKnowledgeGraph = results.result.chart && 
    ['knowledge_graph', 'causal_graph'].includes(results.result.chart.type || '') && 
    results.result.chart.data;

  // Check if there's time series data to display
  const hasTimeSeriesChart = results.result.chart && 
    results.result.chart.type === 'time_series' && 
    results.result.chart.data;
    
  // Check if there's ranking data to display
  const hasRankingChart = results.result.chart && 
    results.result.chart.type === 'ranking' && 
    results.result.chart.data;
    
  // Check if there's standard chart data to display (bar or pie)
  const hasStandardChartData = results.result.chart && 
    results.result.chart.data &&
    !['knowledge_graph', 'causal_graph', 'time_series', 'ranking'].includes(results.result.chart.type || '');

  console.log("Chart type:", results.result.chart?.type);
  console.log("Knowledge graph data:", hasKnowledgeGraph, results.result.chart?.data);
  console.log("Time series data:", hasTimeSeriesChart, results.result.chart?.data);
  console.log("Ranking data:", hasRankingChart, results.result.chart?.data);

  // Format SQL for display
  const formatSql = (sql: string | undefined) => {
    if (!sql) return "";
    return sql.replace(/\n/g, '<br>').replace(/ {2}/g, '&nbsp;&nbsp;');
  };

  const renderSqlButton = () => {
    if (!results.result.sql) return null;
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2 h-6 px-2 py-1 text-xs"
          >
            <Code className="h-3.5 w-3.5 mr-1" />
            SQL
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>SQL Query</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 overflow-auto max-h-[60vh]">
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto whitespace-pre-wrap text-xs">
              {typeof results.result.sql === 'string' ? results.result.sql : JSON.stringify(results.result.sql, null, 2)}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm">
        <AnalysisCard 
          title="Reasoning Type"
          content={results.result.reasoning_justification || results.result.reasoning_type}
          inline={true}
          type="reasoning"
        />
        
        <AnalysisCard 
          title="Reasoning Path"
          titleExtra={renderSqlButton()}
          content={results.result.reasoning_path || (results.result.intent_justification || '')}
          inline={true}
          type="path"
        />

        <AnalysisCard 
          title="AI Answer"
          content={results.result.reasoning_answer}
          inline={true}
          type="answer"
        />
      </div>

      {/* Standard charts (bar, pie) */}
      {(hasStandardChartData || hasTimeSeriesChart || hasRankingChart) && !hasKnowledgeGraph && (
        <div className="grid gap-3 grid-cols-1">
          {results.result.graph && (
            <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm w-full">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Route className="h-4 w-4 text-blue-500" />
                Process Graph
              </h3>
              <ProcessGraph graphData={results.result.graph} />
            </div>
          )}
          
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
          
          {hasRankingChart && (
            <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm w-full">
              <ChartCard
                title="Ranking Analysis"
                subtitle="Ranked comparisons"
                type="ranking"
                data={results.result.chart.data}
                height={500}  /* Slightly taller to accommodate vertical bars */
                className="w-full"
              />
            </div>
          )}
        </div>
      )}

      {/* Knowledge Graph or Causal Graph Visualization */}
      {hasKnowledgeGraph && (
        <div className="space-y-6">
          {/* Single graph visualization */}
          <KnowledgeGraph 
            title={results.result.chart.type === 'knowledge_graph' ? 'Knowledge Graph' : 'Causal Graph'}
            nodes={results.result.chart.data.nodes}
            edges={results.result.chart.data.edges}
            height={550}
          />
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
