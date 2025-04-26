
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getProcessMiningAnalysis } from '@/services/ProcessMiningService';
import { Loader2 } from 'lucide-react';

const questions = [
  "What are the most common training paths?",
  "Where are the biggest bottlenecks in the training process?",
  "Which training sequences lead to the highest certification rates?",
  "What are the average time intervals between training activities?",
  "What process improvements would you recommend based on this analysis?",
  "What patterns exist between job automation risk and training program selection?",
  "Which employee characteristics correlate with successful certification?",
  "What are the implicit relationships between job roles and successful training outcomes?",
  "How does the knowledge graph reveal hidden connections in the workforce reskilling ecosystem?",
  "What personalized training recommendations would you make based on this knowledge graph analysis?",
  "Does high automation risk cause lower training completion rates?",
  "What is the causal effect of training program type on certification outcomes?",
  "What would happen if employees in high-risk jobs were assigned different training programs?",
  "How would a 30% reduction in available training affect overall certification rates?",
  "What interventions would have the highest causal impact on successful reskilling?"
];

const ProcessMining = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    processMining: string;
    knowledgeGraph: string;
    causalGraph: string;
  } | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async (question: string) => {
    setLoading(true);
    try {
      const data = await getProcessMiningAnalysis(question);
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
          <CardTitle>AI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {questions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto py-4 px-6 text-left whitespace-normal"
                onClick={() => handleAnalysis(question)}
                disabled={loading}
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
              {JSON.stringify(results, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ProcessMining;
