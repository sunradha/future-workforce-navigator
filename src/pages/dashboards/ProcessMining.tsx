
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getProcessMiningAnalysis } from '@/services/ProcessMiningService';
import { Loader2, Activity, Layers, LayersThree } from 'lucide-react';

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
        return "Enter your process mining prompt (e.g., 'What are the common training pathways?')";
      case 'knowledge':
        return "Enter your knowledge graph prompt (e.g., 'What skills are connected to which roles?')";
      case 'causal':
        return "Enter your causal graph prompt (e.g., 'What factors influence training success?')";
    }
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
                <LayersThree className="w-4 h-4" />
                Causal Graph
              </TabsTrigger>
            </TabsList>

            {(['process', 'knowledge', 'causal'] as const).map((type) => (
              <TabsContent key={type} value={type}>
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
