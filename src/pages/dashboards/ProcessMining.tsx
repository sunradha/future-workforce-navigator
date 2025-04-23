import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getProcessMiningAnalysis } from '@/services/ProcessMiningService';
import { Loader2, Activity, Layers, Network } from 'lucide-react';

type AnalysisType = 'process' | 'knowledge' | 'causal';

const ProcessMining = () => {
  const [activeTab, setActiveTab] = useState<AnalysisType>('process');
  const [prompts, setPrompts] = useState({
    process: '',
    knowledge: '',
    causal: ''
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    processMining: string;
    knowledgeGraph: string;
    causalGraph: string;
  } | null>(null);
  const { toast } = useToast();

  const handlePromptChange = (type: AnalysisType, value: string) => {
    setPrompts(prev => ({ ...prev, [type]: value }));
  };

  const getPlaceholder = (type: AnalysisType) => {
    switch (type) {
      case 'process':
        return "Example: 'Show me the most common learning paths that result in successful AI certifications'";
      case 'knowledge':
        return "Example: 'What skills and competencies are most strongly connected to successful cloud architect roles?'";
      case 'causal':
        return "Example: 'What factors have the strongest influence on completion rates for cybersecurity training programs?'";
    }
  };

  const handleSampleQuery = () => {
    const sampleQueries = {
      process: "Show me the most common learning paths that result in successful AI certifications",
      knowledge: "What skills and competencies are most strongly connected to successful cloud architect roles?",
      causal: "What factors have the strongest influence on completion rates for cybersecurity training programs?"
    };
    
    handlePromptChange(activeTab, sampleQueries[activeTab]);
  };

  const handleAnalysis = async () => {
    const currentPrompt = prompts[activeTab];
    if (!currentPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for analysis",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await getProcessMiningAnalysis(currentPrompt);
      setResults({
        processMining: data.process_mining_result,
        knowledgeGraph: data.knowledge_graph,
        causalGraph: data.causal_graph,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Graph Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AnalysisType)}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="process" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Process Mining
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Knowledge Graph
              </TabsTrigger>
              <TabsTrigger value="causal" className="flex items-center gap-2">
                <Network className="w-4 h-4" />
                Causal Graph
              </TabsTrigger>
            </TabsList>

            {(['process', 'knowledge', 'causal'] as const).map((type) => (
              <TabsContent key={type} value={type}>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      placeholder={getPlaceholder(type)}
                      value={prompts[type]}
                      onChange={(e) => handlePromptChange(type, e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleAnalysis}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze'
                      )}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSampleQuery}
                    className="w-full"
                  >
                    Try Sample Query
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {results && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Process Mining Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
                {results.processMining}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Knowledge Graph</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
                {results.knowledgeGraph}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Causal Graph</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
                {results.causalGraph}
              </pre>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProcessMining;
