
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
      // Remove quotes and other undesirable formatting
      const cleaned = text
        .replace(/['"]+/g, '')
        .replace(/\[object Object\]/g, '')
        .trim();
      
      // Format ALL_CAPS or snake_case text
      if (cleaned === cleaned.toUpperCase() && cleaned.length > 3) {
        return cleaned.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
      }
      
      // Format snake_case
      if (cleaned.includes('_')) {
        return cleaned.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }
      
      return cleaned;
    }
    
    // If it's an object with a toString method
    if (typeof text === 'object') {
      // Try to use label, name, or id property if available
      if (text.label) return cleanText(text.label);
      if (text.name) return cleanText(text.name);
      if (text.id) return cleanText(text.id);
      
      // Last resort - stringified with JSON
      try {
        return JSON.stringify(text).substring(0, 20);
      } catch (e) {
        return 'Complex Object';
      }
    }
    
    // For numbers, booleans, etc.
    return String(text);
  };

  /**
   * Wraps text to fit within a given width
   * Improved to better handle word breaks
   */
  const wrapText = (text: string, maxLength: number = 15): string[] => {
    if (!text) return [''];
    
    // For very short text, return as is
    if (text.length <= maxLength) return [text];
    
    // Check if there are natural word breaks
    const words = text.split(' ');
    
    // If it's a single long word
    if (words.length === 1) {
      const result = [];
      for (let i = 0; i < text.length; i += maxLength) {
        result.push(text.substring(i, i + maxLength));
      }
      return result.slice(0, 3); // Limit to 3 lines
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
    
    // Abbreviate common terms and improve readability
    return cleanedText
      .replace('Workforce ', '')
      .replace('Employee ', '')
      .replace('Profile', '')
      .replace('Cases', '')
      .replace('Events', '')
      .replace('Survey', '')
      .replace('Program', '');
  };

  return { cleanText, wrapText, formatNodeLabel };
};
