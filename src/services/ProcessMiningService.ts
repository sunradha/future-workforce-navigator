
const API_BASE_URL = 'http://oxford4-capstone-alb-200937979.eu-west-1.elb.amazonaws.com';

export const getProcessMiningAnalysis = async (prompt: string) => {
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

