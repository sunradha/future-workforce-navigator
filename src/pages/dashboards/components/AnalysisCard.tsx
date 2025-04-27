
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface AnalysisCardProps {
  title: string;
  content: string;
  inline?: boolean;
}

const AnalysisCard = ({ title, content, inline = false }: AnalysisCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-1 py-1">
        <FileText className="h-4 w-4" />
        {inline ? (
          <div className="flex items-center gap-1">
            <CardTitle className="text-sm font-medium">{title}:</CardTitle>
            <span className="text-sm">{content}</span>
          </div>
        ) : (
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        )}
      </CardHeader>
      {!inline && (
        <CardContent className="py-1">
          <p className="text-sm">{content}</p>
        </CardContent>
      )}
    </Card>
  );
};

export default AnalysisCard;
