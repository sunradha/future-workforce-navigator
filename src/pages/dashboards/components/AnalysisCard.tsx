
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { FileText, Route, MessageSquare, BarChart, PieChart, ChartLineIcon } from 'lucide-react';

interface AnalysisCardProps {
  title: string;
  content: string;
  inline?: boolean;
  type?: 'reasoning' | 'path' | 'answer' | 'chart';
}

const AnalysisCard = ({ title, content, inline = false, type = 'reasoning' }: AnalysisCardProps) => {
  // Choose the appropriate icon based on the card type
  const getIcon = () => {
    switch (type) {
      case 'reasoning':
        return <FileText className="h-5 w-5 text-indigo-500" />;
      case 'path':
        return <Route className="h-5 w-5 text-blue-500" />;
      case 'answer':
        return <MessageSquare className="h-5 w-5 text-emerald-500" />;
      case 'chart':
        return <BarChart className="h-5 w-5 text-amber-500" />;
      default:
        return <FileText className="h-5 w-5 text-indigo-500" />;
    }
  };

  return (
    <Card className="border-l-4 overflow-hidden transition-all hover:shadow-md" 
          style={{ borderLeftColor: getBorderColor(type) }}>
      <CardHeader className="flex flex-row items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-gray-800">
        {getIcon()}
        {inline ? (
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 w-full">
            <CardTitle className="text-sm font-medium whitespace-nowrap">{title}</CardTitle>
            <span className="text-sm mt-1 sm:mt-0">{content}</span>
          </div>
        ) : (
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        )}
      </CardHeader>
      {!inline && (
        <CardContent className="py-3 px-4">
          <p className="text-sm">{content}</p>
        </CardContent>
      )}
    </Card>
  );
};

// Helper function to get appropriate border color based on card type
const getBorderColor = (type: string) => {
  switch (type) {
    case 'reasoning':
      return '#6366f1'; // indigo
    case 'path':
      return '#3b82f6'; // blue
    case 'answer':
      return '#10b981'; // emerald
    case 'chart':
      return '#f59e0b'; // amber
    default:
      return '#6366f1'; // indigo
  }
};

export default AnalysisCard;
