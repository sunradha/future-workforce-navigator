
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layers, GitGraph, FlowArrow, BarChart2 } from 'lucide-react';

interface QuestionSelectorProps {
  loading: boolean;
  customQuestion: string;
  selectedQuestion: string;
  onCustomQuestionChange: (value: string) => void;
  onSelectedQuestionChange: (value: string) => void;
  onAnalyze: (question: string) => void;
  onTabChange: (value: string) => void;
  questions: string[];
  questionsByCategory?: {
    knowledgeGraph: string[];
    causalGraph: string[];
    processMining: string[];
    generalAnalytics: string[];
  };
}

const QuestionSelector = ({
  loading,
  customQuestion,
  selectedQuestion,
  onCustomQuestionChange,
  onSelectedQuestionChange,
  onAnalyze,
  onTabChange,
  questions,
  questionsByCategory
}: QuestionSelectorProps) => {
  const [mainTab, setMainTab] = useState("predefined");
  const [categoryTab, setCategoryTab] = useState("knowledgeGraph");
  
  // Handle main tab change
  const handleMainTabChange = (value: string) => {
    setMainTab(value);
    onTabChange(value);
  };

  // Current questions based on selected category
  const currentQuestions = questionsByCategory ? 
    questionsByCategory[categoryTab as keyof typeof questionsByCategory] : 
    questions;

  return (
    <Tabs value={mainTab} className="w-full" onValueChange={handleMainTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="predefined">Pre-defined Questions</TabsTrigger>
        <TabsTrigger value="custom">Ask Custom Question</TabsTrigger>
      </TabsList>
      
      <TabsContent value="predefined" className="space-y-4">
        {/* Category tabs */}
        <Tabs value={categoryTab} className="w-full" onValueChange={setCategoryTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="knowledgeGraph" className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              <span>Knowledge Graph</span>
            </TabsTrigger>
            <TabsTrigger value="causalGraph" className="flex items-center gap-1">
              <GitGraph className="h-4 w-4" />
              <span>Causal Graph</span>
            </TabsTrigger>
            <TabsTrigger value="processMining" className="flex items-center gap-1">
              <FlowArrow className="h-4 w-4" />
              <span>Process Flow</span>
            </TabsTrigger>
            <TabsTrigger value="generalAnalytics" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span>General Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Content for each category */}
          {Object.keys(questionsByCategory || {}).map((category) => (
            <TabsContent key={category} value={category} className="space-y-2">
              <Select value={selectedQuestion} onValueChange={onSelectedQuestionChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a question" />
                </SelectTrigger>
                <SelectContent>
                  {currentQuestions.map((question, index) => (
                    <SelectItem key={index} value={question}>
                      {question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>
          ))}
        </Tabs>
        
        <Button 
          onClick={() => onAnalyze(selectedQuestion)}
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
            onChange={(e) => onCustomQuestionChange(e.target.value)}
            className="min-h-[40px] resize-none overflow-hidden"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
            rows={1}
          />
          <Button 
            onClick={() => onAnalyze(customQuestion)}
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
  );
};

export default QuestionSelector;
