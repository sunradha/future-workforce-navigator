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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
    results.result.chart.data &&
    (results.result.chart.data.labels || results.result.chart.data.y);
    
  // Check if there's comparative bar chart data
  const hasComparativeBarChart = results.result.chart &&
    results.result.chart.type === 'comparative_bar' &&
    results.result.chart.data &&
    results.result.chart.data.categories &&
    results.result.chart.data.series;

  // Check if there's standard chart data to display (bar or pie)
  const hasStandardChartData = results.result.chart && 
    results.result.chart.data &&
    !['knowledge_graph', 'causal_graph', 'time_series', 'ranking', 'comparative_bar'].includes(results.result.chart.type || '');

  console.log("Chart type:", results.result.chart?.type);
  console.log("Knowledge graph data:", hasKnowledgeGraph, results.result.chart?.data);
  console.log("Time series data:", hasTimeSeriesChart, results.result.chart?.data);
  console.log("Ranking data:", hasRankingChart, results.result.chart?.data);
  console.log("Comparative bar chart:", hasComparativeBarChart, results.result.chart?.data);

  // Check SQL type
  const hasSqlObject = results.result.sql && typeof results.result.sql === 'object';
  const hasSqlString = results.result.sql && typeof results.result.sql === 'string';

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
            {hasSqlString && (
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto whitespace-pre-wrap text-xs">
                {results.result.sql as string}
              </pre>
            )}
            
            {hasSqlObject && (
              <Tabs defaultValue="nodes" className="w-full">
                <TabsList className="mb-2">
                  <TabsTrigger value="nodes">Nodes SQL</TabsTrigger>
                  <TabsTrigger value="edges">Edges SQL</TabsTrigger>
                </TabsList>
                <TabsContent value="nodes" className="mt-0">
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto whitespace-pre-wrap text-xs">
                    {(results.result.sql as {nodes_sql?: string}).nodes_sql || 'No nodes SQL available'}
                  </pre>
                </TabsContent>
                <TabsContent value="edges" className="mt-0">
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto whitespace-pre-wrap text-xs">
                    {(results.result.sql as {edges_sql?: string}).edges_sql || 'No edges SQL available'}
                  </pre>
                </TabsContent>
              </Tabs>
            )}
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

      {/* Standard charts (bar, pie), time series, ranking and comparative bar charts */}
      {(hasStandardChartData || hasTimeSeriesChart || hasRankingChart || hasComparativeBarChart) && !hasKnowledgeGraph && (
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
                height={550}
                className="w-full"
              />
            </div>
          )}
          
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
