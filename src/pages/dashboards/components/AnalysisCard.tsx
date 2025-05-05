
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { FileText, Route, MessageSquare, BarChart } from 'lucide-react';

interface AnalysisCardProps {
  title: string;
  content: string;
  inline?: boolean;
  type?: 'reasoning' | 'path' | 'answer' | 'chart';
  titleExtra?: React.ReactNode;
}

const AnalysisCard = ({ title, content, inline = false, type = 'reasoning', titleExtra }: AnalysisCardProps) => {
  // Choose the appropriate icon based on the card type
  const getIcon = () => {
    switch (type) {
      case 'reasoning':
        return <FileText className="h-4 w-4 text-indigo-500 flex-shrink-0" />;
      case 'path':
        return <Route className="h-4 w-4 text-blue-500 flex-shrink-0" />;
      case 'answer':
        return <MessageSquare className="h-4 w-4 text-emerald-500 flex-shrink-0" />;
      case 'chart':
        return <BarChart className="h-4 w-4 text-amber-500 flex-shrink-0" />;
      default:
        return <FileText className="h-4 w-4 text-indigo-500 flex-shrink-0" />;
    }
  };

  return (
    <Card 
      className="border-l-4 overflow-hidden transition-all hover:shadow-md mb-3" 
      style={{ borderLeftColor: getBorderColor(type) }}
    >
      <CardHeader className="flex flex-row items-start gap-2 py-2 px-3 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex flex-col space-y-1 w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">{title}</h3>
            {titleExtra}
          </div>
          {inline && <p className="text-sm text-gray-700 dark:text-gray-300 break-words">{content}</p>}
        </div>
      </CardHeader>
      {!inline && (
        <CardContent className="py-2 px-3">
          <p className="text-sm text-gray-700 dark:text-gray-300 break-words">{content}</p>
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
