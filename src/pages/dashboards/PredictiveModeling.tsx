
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabaseService } from '@/services/SupabaseService';
import ChartCard from '@/components/ChartCard';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PredictiveModeling: React.FC = () => {
  const { data: completionByEducation } = useQuery({
    queryKey: ['completionByEducation'],
    queryFn: () => supabaseService.getCompletionRateByEducation(),
  });

  const { data: completionByExperience } = useQuery({
    queryKey: ['completionByExperience'],
    queryFn: () => supabaseService.getCompletionRateByExperience(),
  });

  // Model accuracy metrics (mock data)
  const modelMetrics = {
    accuracy: 83.5,
    precision: 79.2,
    recall: 81.7,
    f1Score: 80.4
  };

  // Key predictive factors (mock data)
  const predictiveFactors = [
    { factor: 'Prior Education Level', importance: 85 },
    { factor: 'Years of Experience', importance: 78 },
    { factor: 'Previous Training History', importance: 72 },
    { factor: 'Current Role Risk Level', importance: 65 },
    { factor: 'Course Type Match', importance: 60 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-6">Predictive Modeling for Reskilling Success</h2>
        <p className="text-gray-600 mb-6">
          Using predictive analytics to identify factors that contribute to successful course completion and skill acquisition.
        </p>
      </div>
      
      <div className="dashboard-stats-grid">
        <StatCard 
          title="Model Accuracy" 
          value={`${modelMetrics.accuracy}%`}
          color="blue"
          icon="chart"
        />
        <StatCard 
          title="Precision" 
          value={`${modelMetrics.precision}%`}
          color="green"
          icon="chart"
        />
        <StatCard 
          title="Recall" 
          value={`${modelMetrics.recall}%`}
          color="yellow"
          icon="chart"
        />
        <StatCard 
          title="F1 Score" 
          value={`${modelMetrics.f1Score}%`}
          color="purple"
          icon="chart"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Key Predictive Factors</CardTitle>
            <p className="text-sm text-muted-foreground">Factors that best predict successful course completion</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictiveFactors.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{item.factor}</span>
                    <span className="text-sm font-medium">{item.importance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-blue-600" 
                      style={{ width: `${item.importance}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Success Probability Model</CardTitle>
            <p className="text-sm text-muted-foreground">Employee characteristics and corresponding success probability</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-medium mb-2">High Success Profile</h3>
                  <ul className="text-sm space-y-2">
                    <li>• Bachelor's degree or higher</li>
                    <li>• 5+ years of experience</li>
                    <li>• Previously completed training</li>
                    <li>• Medium risk current role</li>
                    <li>• Technical skills course match</li>
                  </ul>
                  <div className="mt-3 font-medium text-green-600">85-95% Success Rate</div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-medium mb-2">Medium Success Profile</h3>
                  <ul className="text-sm space-y-2">
                    <li>• Associate degree</li>
                    <li>• 2-5 years of experience</li>
                    <li>• No previous training</li>
                    <li>• High risk current role</li>
                    <li>• Related skills course match</li>
                  </ul>
                  <div className="mt-3 font-medium text-yellow-600">60-75% Success Rate</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-medium mb-2">Low Success Profile</h3>
                  <ul className="text-sm space-y-2">
                    <li>• High school education</li>
                    <li>• Less than 2 years experience</li>
                    <li>• Previously dropped courses</li>
                    <li>• High risk current role</li>
                    <li>• Unrelated skills course match</li>
                  </ul>
                  <div className="mt-3 font-medium text-red-600">30-45% Success Rate</div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-medium mb-2">Intervention Impact</h3>
                  <ul className="text-sm space-y-2">
                    <li>• Pre-course preparation: +15%</li>
                    <li>• Mentorship program: +12%</li>
                    <li>• Flexible schedule: +8%</li>
                    <li>• Peer study groups: +7%</li>
                    <li>• Progress incentives: +10%</li>
                  </ul>
                  <div className="mt-3 font-medium text-blue-600">Up to 25% improvement</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard 
          title="Completion Rate by Education Level" 
          subtitle="How education level affects predicted success"
          type="bar"
          data={completionByEducation || []}
          colors={['#3b82f6']}
        />
        
        <ChartCard 
          title="Completion Rate by Experience" 
          subtitle="How years of experience affects predicted success"
          type="bar"
          data={completionByExperience || []}
          colors={['#8b5cf6']}
        />
      </div>
    </div>
  );
};

export default PredictiveModeling;
