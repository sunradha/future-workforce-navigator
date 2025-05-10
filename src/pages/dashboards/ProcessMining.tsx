
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getProcessMiningAnalysis, ProcessMiningResponse } from '@/services/ProcessMiningService';
import { Loader2, Brain } from 'lucide-react';
import QuestionSelector from './components/QuestionSelector';
import AnalysisResults from './components/AnalysisResults';

const questions = [
  "How have training budgets varied over the years? Is there a trend of increase or decrease?",
  "Which sectors have consistently maintained or increased investment in training programs over the years?",
  "In which sectors has investment in training declined over the years?",
  "Which job roles across sectors are at the highest risk of automation?",
  "Which local authorities in England face a higher risk of job automation compared to others?",
  "Which training programs should be prioritized to address automation risks across industries?",
  "Which training programs were considered the most successful or effective, and why?",
  "Which training programs received the best feedback from employees?",
  "Which training programs were perceived by employees to offer the most benefit?",
  "Which skill categories need prioritization to improve employees' ability to perform their jobs across sectors?",
  "Which training programs were considered highly difficult or challenging by employees?",
  "Which skill categories are associated with high-difficulty training programs?",
  "Which employees struggled across multiple training programs?",
  "What is the average time taken to complete training programs across industries?",
  "Which training programs took longer to complete than others?",
  "Which training programs had the highest number of incomplete cases?",
  "What are the various training programs offered?",
  "Which training program was most popular among employees across industries?",
  "What is the typical progression of employees through training programs?",
  "How have all training programs performed in the last one year?"
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
