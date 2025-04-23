
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabaseService } from '@/services/SupabaseService';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const BudgetAnalysis: React.FC = () => {
  const { data: budgetScenario, isLoading } = useQuery({
    queryKey: ['budgetScenario'],
    queryFn: () => supabaseService.getBudgetScenario(),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount);
  };

  if (isLoading) {
    return <div className="animate-pulse p-8">Loading budget analysis data...</div>;
  }

  // Mock priority scores for courses after budget cut
  const priorityCourses = [
    { course: 'Data Analysis Fundamentals', roi: 8.7, status: 'Keep', cost: 144000 },
    { course: 'Digital Communication Skills', roi: 7.9, status: 'Keep', cost: 120000 },
    { course: 'Advanced Excel for Analysis', roi: 7.5, status: 'Keep', cost: 108000 },
    { course: 'Leadership Skills', roi: 6.9, status: 'Keep', cost: 99000 },
    { course: 'Strategic Thinking', roi: 6.5, status: 'Keep', cost: 110500 },
    { course: 'Cybersecurity Basics', roi: 5.8, status: 'Keep', cost: 142500 },
    { course: 'Project Management Certification', roi: 5.2, status: 'Reduce 30%', cost: 153000 },
    { course: 'Database Management', roi: 4.9, status: 'Reduce 50%', cost: 117000 },
    { course: 'Policy Development', roi: 4.3, status: 'Cut', cost: 82500 },
    { course: 'Programming Fundamentals', roi: 3.8, status: 'Cut', cost: 140000 },
  ];

  const statusColors: Record<string, string> = {
    'Keep': 'bg-green-600',
    'Reduce 30%': 'bg-yellow-600',
    'Reduce 50%': 'bg-orange-600',
    'Cut': 'bg-red-600'
  };

  const budgetComparison = [
    { name: 'Current Budget', value: budgetScenario?.currentBudget || 0, color: '#3b82f6' },
    { name: 'Reduced Budget (30% Cut)', value: budgetScenario?.reducedBudget || 0, color: '#ef4444' },
  ];

  const impactedData = [
    { name: 'Impacted Employees', value: budgetScenario?.impactedEmployees || 0 },
    { name: 'Impacted Courses', value: budgetScenario?.impactedCourses || 0 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-6">Budget Reduction Scenario Analysis</h2>
        <p className="text-gray-600 mb-6">
          Analyzing the impact of a 30% budget reduction on training programs and identifying high ROI initiatives to prioritize.
        </p>
      </div>

      <div className="dashboard-stats-grid">
        <StatCard 
          title="Current Training Budget" 
          value={formatCurrency(budgetScenario?.currentBudget || 0)}
          color="blue"
          icon="chart"
        />
        <StatCard 
          title="Reduced Budget (30% Cut)" 
          value={formatCurrency(budgetScenario?.reducedBudget || 0)}
          type="decrease"
          color="red"
          change={30}
        />
        <StatCard 
          title="Impacted Courses" 
          value={budgetScenario?.impactedCourses || 0}
          color="yellow"
          icon="layers"
        />
        <StatCard 
          title="Impacted Employees" 
          value={budgetScenario?.impactedEmployees || 0}
          color="purple"
          icon="layers"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard 
          title="Budget Comparison" 
          subtitle="Current vs reduced budget after 30% cut"
          type="bar"
          data={budgetComparison}
        />
        
        <ChartCard 
          title="Impact of Budget Cut" 
          subtitle="Employees and courses affected"
          type="bar"
          data={impactedData}
          colors={['#8b5cf6']}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Course Prioritization by ROI</CardTitle>
          <p className="text-sm text-muted-foreground">
            Courses ranked by return on investment with budget cut recommendation
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {priorityCourses.map((course, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium">{course.course}</div>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm">ROI Score: <span className="font-semibold">{course.roi}</span></div>
                    <div className="text-sm">{formatCurrency(course.cost)}</div>
                    <div className={`px-2 py-1 rounded text-xs text-white ${statusColors[course.status]}`}>
                      {course.status}
                    </div>
                  </div>
                </div>
                <Progress 
                  value={course.roi * 10} 
                  className={`h-2 ${
                    course.status === 'Keep' 
                      ? 'bg-gray-100 [&>div]:bg-green-600' 
                      : course.status === 'Cut' 
                        ? 'bg-gray-100 [&>div]:bg-red-600' 
                        : 'bg-gray-100 [&>div]:bg-yellow-600'
                  }`} 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Budget Cut Mitigation Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Cost Optimization</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">•</span>
                  <span>Transition 50% of courses to online delivery (£180,000 savings)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">•</span>
                  <span>Leverage internal trainers instead of external consultants (£95,000 savings)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">•</span>
                  <span>Negotiate bulk discounts with training providers (£65,000 savings)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Program Restructuring</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-0.5">•</span>
                  <span>Combine similar courses to reduce overhead costs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-0.5">•</span>
                  <span>Implement a train-the-trainer model for internal knowledge transfer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-0.5">•</span>
                  <span>Shorten program durations while maintaining core learning objectives</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Alternative Resources</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 mt-0.5">•</span>
                  <span>Utilize free government-sponsored digital skills programs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 mt-0.5">•</span>
                  <span>Establish partnerships with educational institutions for discounted training</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 mt-0.5">•</span>
                  <span>Implement peer learning communities to supplement formal training</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetAnalysis;
