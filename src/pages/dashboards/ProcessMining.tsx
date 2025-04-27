
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getProcessMiningAnalysis, ProcessMiningResponse } from '@/services/ProcessMiningService';
import { Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <CardHeader className="py-3">
          <CardTitle className="text-lg">AI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="predefined" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="predefined">Pre-defined Questions</TabsTrigger>
              <TabsTrigger value="custom">Ask Custom Question</TabsTrigger>
            </TabsList>
            
            <TabsContent value="predefined" className="space-y-2">
              <Select value={selectedQuestion} onValueChange={(value) => setSelectedQuestion(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a question" />
                </SelectTrigger>
                <SelectContent>
                  {questions.map((question, index) => (
                    <SelectItem key={index} value={question}>
                      {question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={() => handleAnalysis(selectedQuestion)}
                disabled={loading || !selectedQuestion}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze"
                )}
              </Button>
            </TabsContent>
            
            <TabsContent value="custom">
              <div className="space-y-2">
                <Textarea
                  placeholder="Type your question here..."
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button 
                  onClick={() => handleAnalysis(customQuestion)}
                  disabled={loading || !customQuestion.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {results && results.result && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 py-2">
                  <FileText className="h-4 w-4" />
                  <CardTitle className="text-sm font-medium">Reasoning Type</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm">{results.result.reasoning_type}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 py-2">
                  <FileText className="h-4 w-4" />
                  <CardTitle className="text-sm font-medium">Reasoning Justification</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm">{results.result.reasoning_justification}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 py-2">
                  <FileText className="h-4 w-4" />
                  <CardTitle className="text-sm font-medium">Intent</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm">{results.result.intent}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 py-2">
                  <FileText className="h-4 w-4" />
                  <CardTitle className="text-sm font-medium">Intent Justification</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm">{results.result.intent_justification}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 py-2">
              <FileText className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Analysis Result</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm">{results.result.reasoning_answer}</p>
            </CardContent>
          </Card>

          {results.result.graph && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 py-2">
                <ImageIcon className="h-4 w-4" />
                <CardTitle className="text-sm font-medium">Process Graph</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <img 
                  src={`data:image/png;base64,${results.result.graph}`}
                  alt="Process Mining Graph"
                  className="max-w-full h-auto"
                />
              </CardContent>
            </Card>
          )}
        </>
      )}

      {loading && !results && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ProcessMining;
