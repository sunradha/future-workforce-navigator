
import React from 'react';
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

interface QuestionSelectorProps {
  loading: boolean;
  customQuestion: string;
  selectedQuestion: string;
  onCustomQuestionChange: (value: string) => void;
  onSelectedQuestionChange: (value: string) => void;
  onAnalyze: (question: string) => void;
  onTabChange: (value: string) => void;
  questions: string[];
}

const QuestionSelector = ({
  loading,
  customQuestion,
  selectedQuestion,
  onCustomQuestionChange,
  onSelectedQuestionChange,
  onAnalyze,
  onTabChange,
  questions
}: QuestionSelectorProps) => {
  return (
    <Tabs defaultValue="predefined" className="w-full" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="predefined">Pre-defined Questions</TabsTrigger>
        <TabsTrigger value="custom">Ask Custom Question</TabsTrigger>
      </TabsList>
      
      <TabsContent value="predefined" className="space-y-2">
        <Select value={selectedQuestion} onValueChange={onSelectedQuestionChange}>
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
