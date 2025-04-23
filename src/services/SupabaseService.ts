
import { 
  Occupation, 
  ReskillEvent, 
  ReskillCase, 
  ChartData, 
  RiskDistribution,
  SuccessRateData,
  BudgetScenario 
} from '../types';

import {
  getHighRiskOccupations,
  getRiskDistribution,
  getTrainingEffectiveness,
  getCompletionRateByEducation,
  getCompletionRateByExperience,
  getCertificationRateByOccupation,
  getBudgetScenario,
  getPriorityReskilling
} from '../data/mockData';

// This service will eventually connect to Supabase 
// For now, it uses the mock data
class SupabaseService {
  // Risk analysis data
  async getHighRiskOccupations(): Promise<Occupation[]> {
    // This would fetch from Supabase table
    return getHighRiskOccupations();
  }

  async getRiskDistribution(): Promise<RiskDistribution> {
    return getRiskDistribution();
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
