import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getProcessMiningAnalysis, ProcessMiningResponse } from '@/services/ProcessMiningService';
import { Loader2, Brain } from 'lucide-react';
import QuestionSelector from './components/QuestionSelector';
import AnalysisResults from './components/AnalysisResults';

// Questions organized by category
const questionsByCategory = {
  knowledgeGraph: [
    "How are employees, their occupations, skill categories, training programs, and sectors connected in the reskilling ecosystem?",
    "Show the connections between employees, their occupations, industries, skills, and locations?",
    "How are training programs linked to occupations and skill categories, and which sectors invest the most in workforce reskilling?",
    "How do different sectors invest in skill categories and training programs, and how are these mapped to occupations and employees?"
  ],
  causalGraph: [
    "What interventions would have the highest causal impact on successful reskilling?",
    "What are the factors that contribute to lower certification rates in low-budget sectors?",
    "Do skill category and sector investment jointly influence training program success?",
    "What factors lead to employee training failures or dropouts, and how do these failures impact later performance or retention?"
  ],
  processMining: [
    "What is the typical progression of employees through training programs?",
    "Which training programs had the highest number of incomplete cases?",
    "What is the average time taken to complete training programs across industries?",
    "How have all training programs performed in the last one year?",
    "Which training program had the most variations in completion paths?"
  ],
  generalAnalytics: [
    "How have training budgets varied over the years? Is there a trend of increase or decrease?",
    "Which training programs were considered the most successful or effective, and why?",
    "Which training programs received the best feedback from employees?",
    "Which training programs were perceived by employees to offer the most benefit?",
    "Which skill categories need prioritization to improve employees' ability to perform their jobs across sectors?"
  ]
};

// Flatten questions for backward compatibility
const allQuestions = [
  ...questionsByCategory.knowledgeGraph,
  ...questionsByCategory.causalGraph,
  ...questionsByCategory.processMining,
  ...questionsByCategory.generalAnalytics
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
            questionsByCategory={questionsByCategory}
            questions={allQuestions}
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
