
import { 
  Occupation, 
  ReskillEvent, 
  ReskillCase, 
  ChartData, 
  RiskDistribution,
  SuccessRateData,
  BudgetScenario 
} from '../types';
import { supabase } from '@/integrations/supabase/client';

class SupabaseService {
  // Risk analysis data
  async getHighRiskOccupations(): Promise<Occupation[]> {
    const { data, error } = await supabase
      .from('job_risk')
      .select('*')
      .order('automation_probability', { ascending: false })
      .limit(10);

    if (error) throw error;

    return data.map(job => ({
      id: job.soc_code,
      title: job.job_title,
      automationRisk: job.automation_probability,
      departmentCount: Math.floor(Math.random() * 100) + 20, // Placeholder since we don't have this in job_risk
      skillCategory: 'Technical', // Placeholder since we don't have this in job_risk
    }));
  }

  async getRiskDistribution(): Promise<RiskDistribution> {
    const { data, error } = await supabase
      .from('job_risk')
      .select('automation_probability');

    if (error) throw error;

    const highRisk = data.filter(job => job.automation_probability >= 0.7).length;
    const mediumRisk = data.filter(job => job.automation_probability >= 0.3 && job.automation_probability < 0.7).length;
    const lowRisk = data.filter(job => job.automation_probability < 0.3).length;

    return {
      highRisk,
      mediumRisk,
      lowRisk
    };
  }

  // Training effectiveness data
  async getTrainingEffectiveness(): Promise<SuccessRateData> {
    const { data, error } = await supabase
      .from('workforce_reskilling_cases')
      .select(`
        training_program,
        certification_earned
      `);

    if (error) throw error;

    const programStats = data.reduce((acc: { [key: string]: { total: number; success: number } }, item) => {
      if (!item.training_program) return acc;
      
      if (!acc[item.training_program]) {
        acc[item.training_program] = { total: 0, success: 0 };
      }
      
      acc[item.training_program].total++;
      if (item.certification_earned) {
        acc[item.training_program].success++;
      }
      
      return acc;
    }, {});

    return Object.entries(programStats).map(([name, stats]) => ({
      name,
      rate: (stats.success / stats.total) * 100
    }));
  }

  async getCompletionRateByEducation(): Promise<ChartData> {
    const { data, error } = await supabase
      .from('fact_demographic_automation_rows')
      .select('qualification, total')
      .not('qualification', 'is', null);

    if (error) throw error;

    return data.map(row => ({
      name: row.qualification || 'Unknown',
      value: row.total || 0
    }));
  }

  async getCompletionRateByExperience(): Promise<ChartData> {
    const { data: cases, error } = await supabase
      .from('workforce_reskilling_cases')
      .select('completion_date, start_date')
      .not('completion_date', 'is', null)
      .not('start_date', 'is', null);

    if (error) throw error;

    // Group by approximate experience duration (in months)
    const experienceGroups = cases.reduce((acc: { [key: string]: number }, item) => {
      const startDate = new Date(item.start_date || '');
      const completionDate = new Date(item.completion_date || '');
      const months = Math.floor((completionDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
      
      const group = months <= 3 ? '0-3 months' :
                   months <= 6 ? '3-6 months' :
                   months <= 12 ? '6-12 months' : '12+ months';
      
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(experienceGroups).map(([name, value]) => ({
      name,
      value
    }));
  }

  async getCertificationRateByOccupation(): Promise<ChartData> {
    const { data, error } = await supabase
      .from('workforce_reskilling_cases')
      .select(`
        certification_earned,
        employee_profile!inner (
          job_risk!inner (
            job_title
          )
        )
      `);

    if (error) throw error;

    const occupationStats = data.reduce((acc: { [key: string]: { total: number; certified: number } }, item) => {
      const jobTitle = item.employee_profile?.job_risk?.job_title;
      if (!jobTitle) return acc;
      
      if (!acc[jobTitle]) {
        acc[jobTitle] = { total: 0, certified: 0 };
      }
      
      acc[jobTitle].total++;
      if (item.certification_earned) {
        acc[jobTitle].certified++;
      }
      
      return acc;
    }, {});

    return Object.entries(occupationStats)
      .map(([name, stats]) => ({
        name,
        value: (stats.certified / stats.total) * 100
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }

  async getBudgetScenario(): Promise<BudgetScenario> {
    const { data: cases, error } = await supabase
      .from('workforce_reskilling_cases')
      .select('*');

    if (error) throw error;

    const currentBudget = cases.length * 5000; // Assuming £5000 per training case
    const reducedBudget = Math.floor(currentBudget * 0.7); // 30% reduction
    const impactedCourses = Math.floor(cases.length * 0.3); // Assuming 30% of courses affected
    const impactedEmployees = Math.floor(cases.length * 0.3); // Assuming 30% of employees affected

    return {
      currentBudget,
      reducedBudget,
      impactedCourses,
      impactedEmployees
    };
  }

  async getPriorityReskilling(): Promise<Occupation[]> {
    const { data, error } = await supabase
      .from('job_risk')
      .select('*')
      .order('automation_probability', { ascending: false })
      .limit(5);

    if (error) throw error;

    return data.map(job => ({
      id: job.soc_code,
      title: job.job_title || 'Unknown Role',
      automationRisk: job.automation_probability || 0,
      departmentCount: Math.floor(Math.random() * 100) + 20, // Placeholder
      skillCategory: 'Technical' // Placeholder
    }));
  }
}

export const supabaseService = new SupabaseService();
