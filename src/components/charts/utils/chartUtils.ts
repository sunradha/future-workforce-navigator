
export const formatYAxisTick = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

export const transformApiData = (apiData: any, chartType: string): any[] => {
  // If data is already in the expected format, return it
  if (Array.isArray(apiData)) {
    return apiData;
  }

  // Handle comparative_bar chart data format (categories and series)
  if (apiData && apiData.categories && apiData.series && chartType === 'comparative_bar') {
    // Filter out null values and transform the data
    return apiData.categories
      .map((category: string, index: number) => {
        if (!category) return null; // Skip null categories
        
        const item: any = { name: category };
        
        // Add data from each series
        apiData.series.forEach((series: any) => {
          if (series.name && series.data && index < series.data.length) {
            item[series.name] = series.data[index];
          }
        });
        
        return item;
      })
      .filter(Boolean); // Remove null entries
  }

  // Handle ranking chart data format (labels and y arrays)
  if (apiData && apiData.labels && apiData.y && chartType === 'ranking') {
    return apiData.labels.map((label: string, index: number) => ({
      name: label || `Item ${index + 1}`,
      value: apiData.y[index] || 0,
    })).filter((item: any) => item.name !== 'null');
  }

  // Handle time series data format
  if (apiData && apiData.x && apiData.y) {
    // For time series, transform the data into an array of objects
    return apiData.x.map((label: string, index: number) => ({
      name: label,
      value: apiData.y[index] || 0,
    }));
  }

  // Handle the API response format where data has x, y, labels
  if (apiData && apiData.y && apiData.labels) {
    return apiData.labels.map((label: string, index: number) => ({
      name: label || `Item ${index + 1}`,
      value: apiData.y[index] || 0,
    })).filter((item: any) => item.name !== 'null');
  }

  // Fallback for empty or invalid data
  return [];
};
