export interface Occupation {
  id: number;
  title: string;
  automationRisk: number;
  departmentCount: number;
  skillCategory: string;
}

export interface ReskillEvent {
  id: number;
  courseTitle: string;
  courseType: string;
  skillCategory: string;
  duration: number;
  cost: number;
  completionRate: number;
  successRate: number;
  enrollmentCount: number;
}

export interface ReskillCase {
  id: number;
  employeeId: string;
  occupation: string;
  courseId: number;
  courseTitle: string;
  startDate: string;
  endDate: string | null;
  status: 'completed' | 'in-progress' | 'dropped' | 'certified';
  certificationEarned: string | null;
  priorEducation: string;
  yearsExperience: number;
}

export type ChartData = {
  name: string;
  value: number;
}[];

export type BarData = {
  name: string;
  value: number;
  color?: string;
}[];

export type RiskDistribution = {
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
};

export type SuccessRateData = {
  name: string;
  rate: number;
}[];

export type BudgetScenario = {
  currentBudget: number;
  reducedBudget: number;
  impactedCourses: number;
  impactedEmployees: number;
};

export type DashboardTab = 'risk' | 'effectiveness' | 'prediction' | 'budget' | 'prioritization' | 'process-mining';

export interface ProcessMiningResponse {
  process_mining_result: string;
  knowledge_graph: string;
  causal_graph: string;
}
