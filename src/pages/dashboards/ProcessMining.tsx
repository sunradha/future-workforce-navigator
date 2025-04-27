import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getProcessMiningAnalysis, ProcessMiningResponse } from '@/services/ProcessMiningService';
import { Loader2 } from 'lucide-react';
import QuestionSelector from './components/QuestionSelector';
import AnalysisResults from './components/AnalysisResults';

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
  const [results, setResults] = useState<ProcessMiningResponse | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const { toast } = useToast();

  const handleAnalysis = async (question: string) => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const data = await getProcessMiningAnalysis(question);
      console.log("API Response:", data);
      setResults(data);
    } catch (error) {
      console.error("Error during analysis:", error);
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
    <div className="grid gap-2">
      <Card className="mb-2">
        <CardHeader className="py-2">
          <CardTitle className="text-lg">AI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionSelector
            loading={loading}
            customQuestion={customQuestion}
            selectedQuestion={selectedQuestion}
            onCustomQuestionChange={setCustomQuestion}
            onSelectedQuestionChange={setSelectedQuestion}
            onAnalyze={handleAnalysis}
            questions={questions}
          />
        </CardContent>
      </Card>

      {results && <AnalysisResults results={results} />}

      {loading && !results && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ProcessMining;
