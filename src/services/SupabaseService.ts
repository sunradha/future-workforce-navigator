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
    return getTrainingEffectiveness();
  }

  async getCompletionRateByEducation(): Promise<ChartData> {
    return getCompletionRateByEducation();
  }

  async getCompletionRateByExperience(): Promise<ChartData> {
    return getCompletionRateByExperience();
  }

  async getCertificationRateByOccupation(): Promise<ChartData> {
    return getCertificationRateByOccupation();
  }

  // Budget scenario data
  async getBudgetScenario(): Promise<BudgetScenario> {
    return getBudgetScenario();
  }

  // Priority reskilling data
  async getPriorityReskilling(): Promise<Occupation[]> {
    return getPriorityReskilling();
  }
}

export const supabaseService = new SupabaseService();
