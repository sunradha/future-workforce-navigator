
const API_BASE_URL = 'http://oxford4-capstone-alb-200937979.eu-west-1.elb.amazonaws.com';

export interface ProcessMiningResponse {
  process_mining_result: string;
  knowledge_graph: string;
  causal_graph: string;
  reasoning_type: string;
  reasoning_justification: string;
  reasoning_intent: string;
  reasoning_intent_justification: string;
}

export const getProcessMiningAnalysis = async (prompt: string): Promise<ProcessMiningResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/process_mining`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch process mining analysis');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching process mining analysis:', error);
    throw error;
  }
};

