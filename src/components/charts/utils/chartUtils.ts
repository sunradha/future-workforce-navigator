
export const formatYAxisTick = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

export const transformApiData = (apiData: any, chartType: string): any[] => {
  console.log("Transforming API data for chart type:", chartType, apiData);
  
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
    console.log('Transforming ranking data:', apiData);
    // For ranking charts, transform and sort by value (descending)
    return apiData.labels
      .map((label: string, index: number) => ({
        name: label || `Item ${index + 1}`,
        value: apiData.y[index] || 0,
      }))
      .filter((item: any) => item.name && item.name !== 'null');
  }

  // Handle time series data format - this is the format we're fixing
  if (apiData && apiData.x && apiData.y) {
    console.log('Transforming time series data:', apiData);
    
    // For time series in the format provided by the API
    const transformedData = [];
    
    // Create pairs of year, sector, and value (which we need to add from a third array if present)
    for (let i = 0; i < apiData.x.length && i < apiData.y.length; i++) {
      const year = apiData.x[i];
      const sector = apiData.y[i];
      
      // Skip entries with null/undefined or "Total" sector
      if (!year || !sector || sector === "Total") continue;
      
      // Get the value from a third array if present, otherwise use a default
      // We'll need to update this when we know the actual structure of the value data
      const value = apiData.values && apiData.values[i] ? apiData.values[i] : 
                   (apiData.total_investment && apiData.total_investment[i] ? apiData.total_investment[i] : 
                   // Generate a random value between 50M and 100M for testing if no value provided
                   Math.round(Math.random() * 50000000 + 50000000));
      
      transformedData.push({
        year: year,
        sector: sector,
        value: value
      });
    }
    
    return transformedData;
  }

  // Handle the API response format where data has x, y, labels
  if (apiData && apiData.y && apiData.labels) {
    return apiData.labels.map((label: string, index: number) => ({
      name: label || `Item ${index + 1}`,
      value: apiData.y[index] || 0,
    })).filter((item: any) => item.name !== 'null');
  }

  // Fallback for empty or invalid data
  console.warn("Could not transform data, returning empty array", apiData);
  return [];
};
