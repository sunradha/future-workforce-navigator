
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface QuestionSelectorProps {
  loading: boolean;
  customQuestion: string;
  selectedQuestion: string;
  onCustomQuestionChange: (question: string) => void;
  onSelectedQuestionChange: (question: string) => void;
  onAnalyze: (question: string) => void;
  onTabChange: () => void;
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
  questions,
}: QuestionSelectorProps) => {
  return (
    <Tabs defaultValue="predefined" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="predefined">Pre-defined Questions</TabsTrigger>
        <TabsTrigger value="custom">Ask Custom Question</TabsTrigger>
      </TabsList>
      
      <TabsContent value="predefined" className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {questions.map((question, index) => (
            <Button
              key={index}
              variant={selectedQuestion === question ? "default" : "outline"}
              className="justify-start h-auto py-2 px-3 text-left"
              onClick={() => onSelectedQuestionChange(question)}
            >
              {question}
            </Button>
          ))}
        </div>
        
        <Button
          className="w-full mt-4"
          onClick={() => onAnalyze(selectedQuestion)}
          disabled={loading || !selectedQuestion}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
            </>
          ) : (
            'Analyze'
          )}
        </Button>
      </TabsContent>
      
      <TabsContent value="custom" className="space-y-4">
        <div>
          <Input
            placeholder="Type your question here..."
            value={customQuestion}
            onChange={(e) => onCustomQuestionChange(e.target.value)}
            className="w-full resize-none"
            style={{
              minHeight: '40px',
              height: 'auto'
            }}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (customQuestion.trim()) {
                  onAnalyze(customQuestion);
                }
              }
            }}
          />
        </div>
        
        <Button
          className="w-full"
          onClick={() => onAnalyze(customQuestion)}
          disabled={loading || !customQuestion.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
            </>
          ) : (
            'Analyze'
          )}
        </Button>
      </TabsContent>
    </Tabs>
  );
};

export default QuestionSelector;
