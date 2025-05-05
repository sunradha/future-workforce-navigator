
import { Node, Edge } from '@/pages/dashboards/types/knowledgeGraphTypes';

const API_BASE_URL = 'https://ox4-capstone-api.onrender.com';

export interface ProcessMiningResponse {
  status: string;
  result: {
    reasoning_type: string;
    reasoning_justification?: string;
    reasoning_path?: string;
    intent?: string;
    intent_justification?: string;
    reasoning_answer: string;
    visualization_type?: string;
    graph?: string;
    chart?: {
      type: string;
      data?: {
        x?: any[];
        y?: number[];
        labels?: string[];
        nodes?: Node[];
        edges?: Edge[];
      };
      schema_kg?: {
        nodes: string[];
        edges: string[];
      };
      data_kg?: {
        nodes: Node[];
        edges: Edge[];
      };
    };
    sql?: string | {
      nodes_sql?: string;
      edges_sql?: string;
    };
    error?: string | null;
  };
}

export const getProcessMiningAnalysis = async (prompt: string): Promise<ProcessMiningResponse> => {
  try {
    console.log("Sending request with prompt:", prompt);
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
    
    const data = await response.json();
    console.log("Received API response:", data);
    return data;
  } catch (error) {
    console.error('Error fetching process mining analysis:', error);
    throw error;
  }
};
