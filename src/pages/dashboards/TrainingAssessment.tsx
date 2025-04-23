
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabaseService } from '@/services/SupabaseService';
import ChartCard from '@/components/ChartCard';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const TrainingAssessment: React.FC = () => {
  const { data: trainingEffectiveness, isLoading: isLoadingEffectiveness } = useQuery({
    queryKey: ['trainingEffectiveness'],
    queryFn: () => supabaseService.getTrainingEffectiveness(),
  });

  const { data: completionByEducation, isLoading: isLoadingEducation } = useQuery({
    queryKey: ['completionByEducation'],
    queryFn: () => supabaseService.getCompletionRateByEducation(),
  });

  const { data: completionByExperience, isLoading: isLoadingExperience } = useQuery({
    queryKey: ['completionByExperience'],
    queryFn: () => supabaseService.getCompletionRateByExperience(),
  });

  const { data: certificationByOccupation, isLoading: isLoadingCertification } = useQuery({
    queryKey: ['certificationByOccupation'],
    queryFn: () => supabaseService.getCertificationRateByOccupation(),
  });

  if (isLoadingEffectiveness || isLoadingEducation || isLoadingExperience || isLoadingCertification) {
    return <div className="animate-pulse p-8">Loading training effectiveness data...</div>;
  }

  const averageSuccessRate = trainingEffectiveness?.reduce((acc, course) => acc + course.rate, 0) || 0;
  const avgSuccess = averageSuccessRate > 0 ? (averageSuccessRate / (trainingEffectiveness?.length || 1)).toFixed(1) : '0';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-6">Training Program Assessment</h2>
        <p className="text-gray-600 mb-6">
          Evaluating the effectiveness of current training and reskilling programs to optimize learning outcomes.
        </p>
      </div>

      <div className="dashboard-stats-grid">
        <StatCard 
          title="Average Success Rate" 
          value={`${avgSuccess}%`}
          type="increase"
          color="green"
        />
        <StatCard 
          title="Course Completion Rate" 
          value="78.4%"
          change={2.1}
          type="increase"
          color="blue"
        />
        <StatCard 
          title="Certification Earned" 
          value="64.3%"
          change={-1.5}
          type="decrease"
          color="purple"
        />
        <StatCard 
          title="Average Course Duration" 
          value="8.5 weeks"
          icon="none"
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Course Success Rates</CardTitle>
            <p className="text-sm text-muted-foreground">Success rate by course (percentage)</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {trainingEffectiveness?.sort((a, b) => b.rate - a.rate).map((course, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{course.name}</span>
                  <span className="text-sm font-medium">{course.rate.toFixed(1)}%</span>
                </div>
                <Progress value={course.rate} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard 
          title="Completion Rate by Education Level" 
          subtitle="How education affects course completion"
          type="bar"
          data={completionByEducation || []}
          colors={['#3b82f6']}
        />
        
        <ChartCard 
          title="Completion Rate by Years of Experience" 
          subtitle="How experience affects course completion"
          type="bar"
          data={completionByExperience || []}
          colors={['#8b5cf6']}
        />
      </div>

      <ChartCard 
        title="Certification Rate by Occupation" 
        subtitle="Percentage of completed courses that led to certification"
        type="bar"
        data={certificationByOccupation || []}
        colors={['#10b981']}
        height={400}
      />
    </div>
  );
};

export default TrainingAssessment;
