
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabaseService } from '@/services/SupabaseService';
import DataTable from '@/components/DataTable';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RolePrioritization: React.FC = () => {
  const { data: priorityRoles, isLoading } = useQuery({
    queryKey: ['priorityReskilling'],
    queryFn: () => supabaseService.getPriorityReskilling(),
  });

  const { data: trainingEffectiveness } = useQuery({
    queryKey: ['trainingEffectiveness'],
    queryFn: () => supabaseService.getTrainingEffectiveness(),
  });

  if (isLoading) {
    return <div className="animate-pulse p-8">Loading role prioritization data...</div>;
  }

  // Calculate total employees at high risk
  const totalHighRiskEmployees = priorityRoles?.reduce((sum, role) => sum + role.departmentCount, 0) || 0;

  // Create chart data for priority index
  const priorityIndexData = priorityRoles?.map(role => ({
    name: role.title,
    value: +(role.automationRisk * 100).toFixed(1),
    color: '#ef4444'
  })) || [];

  const employeeCountData = priorityRoles?.map(role => ({
    name: role.title,
    value: role.departmentCount,
    color: '#3b82f6'
  })) || [];

  // Mock recommended courses for high risk roles
  const recommendedCourses = [
    {
      role: 'Administrative Assistant',
      courses: [
        { name: 'Data Analysis Fundamentals', match: 92 },
        { name: 'Digital Communication Skills', match: 88 },
        { name: 'Project Management Certification', match: 79 }
      ]
    },
    {
      role: 'Data Entry Operator',
      courses: [
        { name: 'Programming Fundamentals', match: 95 },
        { name: 'Database Management', match: 91 },
        { name: 'Advanced Excel for Analysis', match: 87 }
      ]
    },
    {
      role: 'Accounting Technician',
      courses: [
        { name: 'Advanced Excel for Analysis', match: 94 },
        { name: 'Data Analysis Fundamentals', match: 88 },
        { name: 'Database Management', match: 82 }
      ]
    },
    {
      role: 'Mail Clerk',
      courses: [
        { name: 'Digital Communication Skills', match: 89 },
        { name: 'Database Management', match: 76 },
        { name: 'Customer Service Excellence', match: 85 }
      ]
    },
    {
      role: 'File Clerk',
      courses: [
        { name: 'Database Management', match: 93 },
        { name: 'Digital Document Management', match: 90 },
        { name: 'Information Security Basics', match: 81 }
      ]
    }
  ];

  const columns = [
    { key: 'title', label: 'Job Title' },
    { key: 'automationRisk', label: 'Automation Risk', 
      format: (value: number) => `${(value * 100).toFixed(0)}%` 
    },
    { key: 'departmentCount', label: 'Employee Count' },
    { key: 'skillCategory', label: 'Current Skill Category' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-6">Role Prioritization for Reskilling</h2>
        <p className="text-gray-600 mb-6">
          Prioritizing which roles to focus reskilling efforts on based on automation risk, employee count, and strategic value.
        </p>
      </div>

      <div className="dashboard-stats-grid">
        <StatCard 
          title="Priority Roles Identified" 
          value={priorityRoles?.length || 0}
          color="red"
          icon="layers"
        />
        <StatCard 
          title="Employees to Reskill" 
          value={totalHighRiskEmployees}
          color="blue"
          icon="layers"
        />
        <StatCard 
          title="Est. Training Investment" 
          value={`£${(totalHighRiskEmployees * 1200).toLocaleString()}`}
          color="purple"
          icon="chart"
        />
        <StatCard 
          title="Programs Recommended" 
          value="8"
          color="green"
          icon="chart"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard 
          title="Top 5 Priority Roles" 
          subtitle="Ranked by automation risk percentage"
          type="bar"
          data={priorityIndexData}
        />

        <ChartCard 
          title="Employee Count by Priority Role" 
          subtitle="Number of employees in each priority role"
          type="bar"
          data={employeeCountData}
        />
      </div>

      <DataTable 
        title="Priority Roles for Reskilling" 
        data={priorityRoles || []}
        columns={columns}
      />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Recommended Training Programs by Role</CardTitle>
          <p className="text-sm text-muted-foreground">Suggested courses based on skill gaps and future needs</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recommendedCourses.map((item, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                <h3 className="font-semibold mb-3">{item.role}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {item.courses.map((course, cIndex) => (
                    <div key={cIndex} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium">{course.name}</div>
                        <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                          {course.match}% match
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div 
                          className="h-1.5 rounded-full bg-green-600" 
                          style={{ width: `${course.match}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Implementation Timeline</CardTitle>
          <p className="text-sm text-muted-foreground">Phased approach to reskilling priority roles</p>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline connector */}
            <div className="absolute left-7 top-0 w-1 h-full bg-gray-200"></div>
            
            <div className="space-y-8">
              <div className="relative flex items-start">
                <div className="h-14 w-14 rounded-full bg-blue-100 border-4 border-white shadow flex items-center justify-center z-10">
                  <span className="font-bold text-blue-600">Q2</span>
                </div>
                <div className="ml-6 pt-1">
                  <h3 className="font-semibold">Phase 1: Assessment</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="text-sm">• Evaluate skills gap for Administrative Assistants and Data Entry Operators</li>
                    <li className="text-sm">• Develop personalized training pathways</li>
                    <li className="text-sm">• Identify internal mentors and resources</li>
                  </ul>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="h-14 w-14 rounded-full bg-green-100 border-4 border-white shadow flex items-center justify-center z-10">
                  <span className="font-bold text-green-600">Q3</span>
                </div>
                <div className="ml-6 pt-1">
                  <h3 className="font-semibold">Phase 2: Initiate Training</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="text-sm">• Begin training for first cohort (120 employees)</li>
                    <li className="text-sm">• Launch data analysis and digital skills programs</li>
                    <li className="text-sm">• Implement progress tracking system</li>
                  </ul>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="h-14 w-14 rounded-full bg-purple-100 border-4 border-white shadow flex items-center justify-center z-10">
                  <span className="font-bold text-purple-600">Q4</span>
                </div>
                <div className="ml-6 pt-1">
                  <h3 className="font-semibold">Phase 3: Expand Program</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="text-sm">• Begin training for second cohort (150 employees)</li>
                    <li className="text-sm">• Evaluate and optimize first cohort programs</li>
                    <li className="text-sm">• Develop advanced skill tracks for high performers</li>
                  </ul>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="h-14 w-14 rounded-full bg-yellow-100 border-4 border-white shadow flex items-center justify-center z-10">
                  <span className="font-bold text-yellow-600">Q1</span>
                </div>
                <div className="ml-6 pt-1">
                  <h3 className="font-semibold">Phase 4: Transition</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="text-sm">• Begin role transitions for successfully reskilled employees</li>
                    <li className="text-sm">• Evaluate program ROI and outcomes</li>
                    <li className="text-sm">• Adjust workforce planning based on results</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolePrioritization;
