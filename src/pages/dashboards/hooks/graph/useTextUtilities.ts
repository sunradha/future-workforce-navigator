
/**
 * Helper functions to safely clean and format text for D3 graph elements
 */
export const useTextUtilities = () => {
  const cleanText = (text: any): string => {
    // Handle null or undefined
    if (text === null || text === undefined) {
      return 'N/A';
    }
    
    // If it's a string, clean it
    if (typeof text === 'string') {
      // Remove quotes, [object Object], and other undesirable formatting
      return text.replace(/['"]+/g, '').replace(/\[object Object\]/g, '');
    }
    
    // If it's an object with a toString method that would return [object Object],
    // try to get a better representation
    if (typeof text === 'object') {
      // Try to use label or name property if available
      if (text.label) return cleanText(text.label);
      if (text.name) return cleanText(text.name);
      if (text.id) return cleanText(text.id);
      
      // Last resort - stringified with JSON
      try {
        return JSON.stringify(text).substring(0, 15);
      } catch (e) {
        return 'Complex Object';
      }
    }
    
    // For numbers, booleans, etc.
    return String(text);
  };

  return { cleanText };
};
