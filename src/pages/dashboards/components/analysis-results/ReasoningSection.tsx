
import React from 'react';
import AnalysisCard from '../AnalysisCard';
import SqlDialog from './SqlDialog';
import { ProcessMiningResponse } from '@/services/ProcessMiningService';

interface ReasoningSectionProps {
  results: ProcessMiningResponse;
}

const ReasoningSection: React.FC<ReasoningSectionProps> = ({ results }) => {
  if (!results?.result) return null;

  const renderSqlButton = () => {
    if (!results.result.sql) return null;
    return <SqlDialog sql={results.result.sql} />;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm">
      <AnalysisCard 
        title="Reasoning Type"
        content={results.result.reasoning_justification || results.result.reasoning_type}
        inline={true}
        type="reasoning"
      />
      
      <AnalysisCard 
        title="Reasoning Path"
        titleExtra={renderSqlButton()}
        content={results.result.reasoning_path || (results.result.intent_justification || '')}
        inline={true}
        type="path"
      />

      <AnalysisCard 
        title="AI Answer"
        content={results.result.reasoning_answer}
        inline={true}
        type="answer"
      />
    </div>
  );
};

export default ReasoningSection;
