
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getProcessMiningAnalysis } from '@/services/ProcessMiningService';
import { Loader2 } from 'lucide-react';

const ProcessMining = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    processMining: string;
    knowledgeGraph: string;
    causalGraph: string;
  } | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for analysis",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await getProcessMiningAnalysis(prompt);
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
          <CardTitle>Process Mining & Graph Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter your analysis prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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

