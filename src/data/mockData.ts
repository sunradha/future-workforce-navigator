
import { 
  Occupation, 
  ReskillEvent, 
  ReskillCase, 
  ChartData, 
  RiskDistribution,
  SuccessRateData,
  BudgetScenario 
} from '../types';

// Mock Occupations with automation risk
export const occupations: Occupation[] = [
  { id: 1, title: 'Administrative Assistant', automationRisk: 0.89, departmentCount: 120, skillCategory: 'Administrative' },
  { id: 2, title: 'Data Entry Operator', automationRisk: 0.94, departmentCount: 75, skillCategory: 'Administrative' },
  { id: 3, title: 'Accounting Technician', automationRisk: 0.86, departmentCount: 90, skillCategory: 'Finance' },
  { id: 4, title: 'Mail Clerk', automationRisk: 0.92, departmentCount: 40, skillCategory: 'Administrative' },
  { id: 5, title: 'File Clerk', automationRisk: 0.90, departmentCount: 65, skillCategory: 'Administrative' },
  { id: 6, title: 'Form Reviewer', automationRisk: 0.83, departmentCount: 55, skillCategory: 'Administrative' },
  { id: 7, title: 'Claims Processor', automationRisk: 0.77, departmentCount: 80, skillCategory: 'Finance' },
  { id: 8, title: 'Benefits Administrator', automationRisk: 0.65, departmentCount: 70, skillCategory: 'HR' },
  { id: 9, title: 'Procurement Clerk', automationRisk: 0.85, departmentCount: 60, skillCategory: 'Finance' },
  { id: 10, title: 'Records Manager', automationRisk: 0.82, departmentCount: 45, skillCategory: 'Administrative' },
  { id: 11, title: 'Policy Analyst', automationRisk: 0.15, departmentCount: 85, skillCategory: 'Policy' },
  { id: 12, title: 'HR Specialist', automationRisk: 0.31, departmentCount: 65, skillCategory: 'HR' },
  { id: 13, title: 'Project Manager', automationRisk: 0.22, departmentCount: 75, skillCategory: 'Management' },
  { id: 14, title: 'IT Security Analyst', automationRisk: 0.21, departmentCount: 40, skillCategory: 'IT' },
  { id: 15, title: 'Data Scientist', automationRisk: 0.18, departmentCount: 35, skillCategory: 'IT' },
];

// Mock Reskill Events (Training Programs)
export const reskillEvents: ReskillEvent[] = [
  { id: 101, courseTitle: 'Data Analysis Fundamentals', courseType: 'Technical', skillCategory: 'IT', duration: 8, cost: 1200, completionRate: 0.84, successRate: 0.76, enrollmentCount: 120 },
  { id: 102, courseTitle: 'Project Management Certification', courseType: 'Management', skillCategory: 'Management', duration: 12, cost: 1800, completionRate: 0.71, successRate: 0.65, enrollmentCount: 85 },
  { id: 103, courseTitle: 'Cybersecurity Basics', courseType: 'Technical', skillCategory: 'IT', duration: 10, cost: 1500, completionRate: 0.78, successRate: 0.72, enrollmentCount: 95 },
  { id: 104, courseTitle: 'Digital Communication Skills', courseType: 'Soft Skills', skillCategory: 'Communication', duration: 6, cost: 800, completionRate: 0.92, successRate: 0.88, enrollmentCount: 150 },
  { id: 105, courseTitle: 'Advanced Excel for Analysis', courseType: 'Technical', skillCategory: 'IT', duration: 5, cost: 600, completionRate: 0.89, successRate: 0.85, enrollmentCount: 180 },
  { id: 106, courseTitle: 'Policy Development', courseType: 'Domain Knowledge', skillCategory: 'Policy', duration: 8, cost: 1100, completionRate: 0.75, successRate: 0.67, enrollmentCount: 75 },
  { id: 107, courseTitle: 'Leadership Skills', courseType: 'Soft Skills', skillCategory: 'Management', duration: 7, cost: 900, completionRate: 0.81, successRate: 0.74, enrollmentCount: 110 },
  { id: 108, courseTitle: 'Programming Fundamentals', courseType: 'Technical', skillCategory: 'IT', duration: 14, cost: 2000, completionRate: 0.65, successRate: 0.53, enrollmentCount: 70 },
  { id: 109, courseTitle: 'Strategic Thinking', courseType: 'Soft Skills', skillCategory: 'Management', duration: 6, cost: 850, completionRate: 0.88, successRate: 0.79, enrollmentCount: 130 },
  { id: 110, courseTitle: 'Database Management', courseType: 'Technical', skillCategory: 'IT', duration: 9, cost: 1300, completionRate: 0.73, successRate: 0.68, enrollmentCount: 90 },
];

// Mock Reskill Cases (Individual Training Records)
export const reskillCases: ReskillCase[] = [
  { id: 1001, employeeId: 'EMP001', occupation: 'Administrative Assistant', courseId: 105, courseTitle: 'Advanced Excel for Analysis', startDate: '2023-03-15', endDate: '2023-04-20', status: 'certified', certificationEarned: 'Excel Advanced User', priorEducation: 'Bachelor', yearsExperience: 5 },
  { id: 1002, employeeId: 'EMP002', occupation: 'Data Entry Operator', courseId: 108, courseTitle: 'Programming Fundamentals', startDate: '2023-02-10', endDate: null, status: 'dropped', certificationEarned: null, priorEducation: 'High School', yearsExperience: 3 },
  { id: 1003, employeeId: 'EMP003', occupation: 'Accounting Technician', courseId: 105, courseTitle: 'Advanced Excel for Analysis', startDate: '2023-04-05', endDate: '2023-05-10', status: 'completed', certificationEarned: null, priorEducation: 'Associate', yearsExperience: 7 },
  { id: 1004, employeeId: 'EMP004', occupation: 'Mail Clerk', courseId: 104, courseTitle: 'Digital Communication Skills', startDate: '2023-01-20', endDate: '2023-02-25', status: 'certified', certificationEarned: 'Digital Communication Certificate', priorEducation: 'High School', yearsExperience: 2 },
  { id: 1005, employeeId: 'EMP005', occupation: 'File Clerk', courseId: 110, courseTitle: 'Database Management', startDate: '2023-05-12', endDate: null, status: 'in-progress', certificationEarned: null, priorEducation: 'Associate', yearsExperience: 4 },
  { id: 1006, employeeId: 'EMP006', occupation: 'Administrative Assistant', courseId: 107, courseTitle: 'Leadership Skills', startDate: '2023-03-01', endDate: '2023-04-15', status: 'completed', certificationEarned: null, priorEducation: 'Bachelor', yearsExperience: 6 },
  { id: 1007, employeeId: 'EMP007', occupation: 'Benefits Administrator', courseId: 102, courseTitle: 'Project Management Certification', startDate: '2023-02-15', endDate: '2023-05-10', status: 'certified', certificationEarned: 'Project Management Professional', priorEducation: 'Master', yearsExperience: 8 },
  { id: 1008, employeeId: 'EMP008', occupation: 'Claims Processor', courseId: 103, courseTitle: 'Cybersecurity Basics', startDate: '2023-04-10', endDate: null, status: 'in-progress', certificationEarned: null, priorEducation: 'Bachelor', yearsExperience: 5 },
  { id: 1009, employeeId: 'EMP009', occupation: 'Data Entry Operator', courseId: 101, courseTitle: 'Data Analysis Fundamentals', startDate: '2023-03-20', endDate: '2023-05-15', status: 'completed', certificationEarned: null, priorEducation: 'Associate', yearsExperience: 3 },
  { id: 1010, employeeId: 'EMP010', occupation: 'Records Manager', courseId: 110, courseTitle: 'Database Management', startDate: '2023-01-10', endDate: '2023-03-15', status: 'certified', certificationEarned: 'Database Associate', priorEducation: 'Bachelor', yearsExperience: 7 },
  // Add more cases to have a good dataset
  { id: 1011, employeeId: 'EMP011', occupation: 'Administrative Assistant', courseId: 104, courseTitle: 'Digital Communication Skills', startDate: '2023-02-01', endDate: '2023-03-10', status: 'certified', certificationEarned: 'Communication Certificate', priorEducation: 'Associate', yearsExperience: 4 },
  { id: 1012, employeeId: 'EMP012', occupation: 'Form Reviewer', courseId: 101, courseTitle: 'Data Analysis Fundamentals', startDate: '2023-03-05', endDate: null, status: 'dropped', certificationEarned: null, priorEducation: 'High School', yearsExperience: 2 },
  { id: 1013, employeeId: 'EMP013', occupation: 'Procurement Clerk', courseId: 102, courseTitle: 'Project Management Certification', startDate: '2023-04-15', endDate: null, status: 'in-progress', certificationEarned: null, priorEducation: 'Bachelor', yearsExperience: 5 },
  { id: 1014, employeeId: 'EMP014', occupation: 'Records Manager', courseId: 103, courseTitle: 'Cybersecurity Basics', startDate: '2023-02-20', endDate: '2023-04-25', status: 'completed', certificationEarned: null, priorEducation: 'Associate', yearsExperience: 6 },
  { id: 1015, employeeId: 'EMP015', occupation: 'Accounting Technician', courseId: 107, courseTitle: 'Leadership Skills', startDate: '2023-01-15', endDate: '2023-03-01', status: 'certified', certificationEarned: 'Leadership Certificate', priorEducation: 'Bachelor', yearsExperience: 8 },
];

// Functions to generate analytical data
export const getHighRiskOccupations = (): Occupation[] => {
  return [...occupations]
    .sort((a, b) => b.automationRisk - a.automationRisk)
    .slice(0, 10);
};

export const getRiskDistribution = (): RiskDistribution => {
  const highRisk = occupations.filter(o => o.automationRisk >= 0.7).length;
  const mediumRisk = occupations.filter(o => o.automationRisk >= 0.3 && o.automationRisk < 0.7).length;
  const lowRisk = occupations.filter(o => o.automationRisk < 0.3).length;
  
  return { highRisk, mediumRisk, lowRisk };
};

export const getTrainingEffectiveness = (): SuccessRateData => {
  return reskillEvents.map(event => ({
    name: event.courseTitle,
    rate: event.successRate * 100
  }));
};

export const getCompletionRateByEducation = (): ChartData => {
  const educationGroups: { [key: string]: { completed: number, total: number } } = {};
  
  reskillCases.forEach(c => {
    if (!educationGroups[c.priorEducation]) {
      educationGroups[c.priorEducation] = { completed: 0, total: 0 };
    }
    
    educationGroups[c.priorEducation].total += 1;
    if (c.status === 'completed' || c.status === 'certified') {
      educationGroups[c.priorEducation].completed += 1;
    }
  });
  
  return Object.entries(educationGroups).map(([edu, data]) => ({
    name: edu,
    value: (data.completed / data.total) * 100
  }));
};

export const getCompletionRateByExperience = (): ChartData => {
  const experienceGroups: { [key: string]: { completed: number, total: number } } = {
    '0-2': { completed: 0, total: 0 },
    '3-5': { completed: 0, total: 0 },
    '6-10': { completed: 0, total: 0 },
    '10+': { completed: 0, total: 0 }
  };
  
  reskillCases.forEach(c => {
    let group = '10+';
    if (c.yearsExperience <= 2) group = '0-2';
    else if (c.yearsExperience <= 5) group = '3-5';
    else if (c.yearsExperience <= 10) group = '6-10';
    
    experienceGroups[group].total += 1;
    if (c.status === 'completed' || c.status === 'certified') {
      experienceGroups[group].completed += 1;
    }
  });
  
  return Object.entries(experienceGroups).map(([exp, data]) => ({
    name: exp,
    value: data.total > 0 ? (data.completed / data.total) * 100 : 0
  }));
};

export const getCertificationRateByOccupation = (): ChartData => {
  const occupationGroups: { [key: string]: { certified: number, completed: number } } = {};
  
  reskillCases.forEach(c => {
    if (!occupationGroups[c.occupation]) {
      occupationGroups[c.occupation] = { certified: 0, completed: 0 };
    }
    
    if (c.status === 'completed' || c.status === 'certified') {
      occupationGroups[c.occupation].completed += 1;
      if (c.status === 'certified') {
        occupationGroups[c.occupation].certified += 1;
      }
    }
  });
  
  return Object.entries(occupationGroups).map(([occ, data]) => ({
    name: occ,
    value: data.completed > 0 ? (data.certified / data.completed) * 100 : 0
  }));
};

export const getBudgetScenario = (): BudgetScenario => {
  const totalBudget = reskillEvents.reduce((sum, event) => sum + (event.cost * event.enrollmentCount), 0);
  const reducedBudget = totalBudget * 0.7;
  
  // Sort events by ROI (success rate / cost)
  const sortedEvents = [...reskillEvents].sort((a, b) => 
    (b.successRate / b.cost) - (a.successRate / a.cost)
  );
  
  let runningCost = 0;
  let cutEvents = 0;
  let cutEnrollments = 0;
  
  // Calculate how many courses would be cut with 30% budget reduction
  for (let i = sortedEvents.length - 1; i >= 0; i--) {
    const event = sortedEvents[i];
    const eventCost = event.cost * event.enrollmentCount;
    runningCost += eventCost;
    
    if (runningCost <= totalBudget - reducedBudget) {
      cutEvents++;
      cutEnrollments += event.enrollmentCount;
    } else {
      // Partial cut of last course
      const remainingBudget = (totalBudget - reducedBudget) - (runningCost - eventCost);
      const partialEnrollments = Math.floor(remainingBudget / event.cost);
      cutEnrollments += (event.enrollmentCount - partialEnrollments);
      break;
    }
  }
  
  return {
    currentBudget: totalBudget,
    reducedBudget,
    impactedCourses: cutEvents,
    impactedEmployees: cutEnrollments
  };
};

export const getPriorityReskilling = (): Occupation[] => {
  // Prioritize based on combination of risk and department count
  return [...occupations]
    .filter(o => o.automationRisk > 0.7) // Only high-risk roles
    .sort((a, b) => (b.automationRisk * b.departmentCount) - (a.automationRisk * a.departmentCount))
    .slice(0, 5);
};
