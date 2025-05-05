import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getProcessMiningAnalysis, ProcessMiningResponse } from '@/services/ProcessMiningService';
import { Loader2, Brain } from 'lucide-react';
import QuestionSelector from './components/QuestionSelector';
import AnalysisResults from './components/AnalysisResults';

const questions = [
  "How training budgets have varied over the years and any correlation with increase or decrease in the training budget?",
  "Which job roles across sectors are at maximum risk of automation?",
  "What are the local authorities in England that are at higher risk of job automation than other places in England?",
  "Which training programs were deemed more successful or effective than others and Why?",
  "Which training programs were having high level of difficulty or perceived difficulty by employees?",
  "Which skills needs prioritization to improve the skill levels of employees to perform their job most across different sectors?",
  "Evaluate the performance of all training programs conducted in the last one year?",
  "Which training programs were having high level of difficulty or perceived difficulty by employees?",
  "Which skill categories lead to the most high-difficulty programs?",
  "Which employees struggled across multiple programs?"
];

const ProcessMining = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProcessMiningResponse | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [showResults, setShowResults] = useState(true);
  const { toast } = useToast();

  const handleAnalysis = async (question: string) => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const data = await getProcessMiningAnalysis(question);
      console.log("API Response:", data);
      setResults(data);
      setShowResults(true);
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

  const handleTabChange = () => {
    setShowResults(false);
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="py-4 flex flex-row items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">AI Knowledge Analysis</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <QuestionSelector
            loading={loading}
            customQuestion={customQuestion}
            selectedQuestion={selectedQuestion}
            onCustomQuestionChange={setCustomQuestion}
            onSelectedQuestionChange={setSelectedQuestion}
            onAnalyze={handleAnalysis}
            onTabChange={handleTabChange}
            questions={questions}
          />
        </CardContent>
      </Card>

      {results && <AnalysisResults results={results} visible={showResults} />}

      {loading && !results && (
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Analyzing your question...</p>
        </div>
      )}
    </div>
  );
};

export default ProcessMining;
