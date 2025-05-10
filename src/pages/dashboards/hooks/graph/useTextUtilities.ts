
/**
 * Helper functions to safely clean and format text for D3 graph elements
 */
export const useTextUtilities = () => {
  /**
   * Cleans and formats text for display in graph elements
   */
  const cleanText = (text: any): string => {
    // Handle null or undefined
    if (text === null || text === undefined) {
      return 'N/A';
    }
    
    // If it's a string, clean it
    if (typeof text === 'string') {
      // Remove quotes, [object Object], and other undesirable formatting
      const cleaned = text.replace(/['"]+/g, '').replace(/\[object Object\]/g, '');
      
      // Clean up relationship text in all caps
      if (cleaned === cleaned.toUpperCase() && cleaned.length > 3) {
        return cleaned.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
      }
      
      return cleaned;
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

  /**
   * Wraps text to fit within a given width
   */
  const wrapText = (text: string, maxLength: number = 15): string[] => {
    if (!text) return [''];
    
    // For very short text, return as is
    if (text.length <= maxLength) return [text];
    
    // Check if there are natural word breaks
    const words = text.split(' ');
    
    // If it's a single long word
    if (words.length === 1) {
      return [text.substring(0, maxLength), text.substring(maxLength)];
    }
    
    // Try to break by words
    const lines: string[] = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
      if ((currentLine + ' ' + words[i]).length <= maxLength) {
        currentLine += ' ' + words[i];
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // If we have too many lines, consolidate
    if (lines.length > 3) {
      return [
        lines[0],
        lines[1],
        lines[2] + '...'
      ];
    }
    
    return lines;
  };
  
  /**
   * Returns properly formatted and abbreviated entity labels
   */
  const formatNodeLabel = (label: any): string => {
    const cleanedText = cleanText(label);
    
    // Abbreviate common terms to save space
    return cleanedText
      .replace('Workforce ', '')
      .replace('Employee ', '');
  };

  return { cleanText, wrapText, formatNodeLabel };
};
