
const API_BASE_URL = 'https://ox4-capstone-api.onrender.com';

export interface ProcessMiningResponse {
  status: string;
  result: {
    reasoning_type: string;
    reasoning_justification: string;
    reasoning_path?: string;
    intent: string;
    intent_justification: string;
    reasoning_answer: string;
    graph: string;
    chart?: {
      type: string;
      data: any;
      schema_kg?: {
        nodes: any[];
        edges: any[];
      };
      data_kg?: {
        nodes: any[];
        edges: any[];
      };
    };
  };
}

export const getProcessMiningAnalysis = async (prompt: string): Promise<ProcessMiningResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ask-question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: prompt }),
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
