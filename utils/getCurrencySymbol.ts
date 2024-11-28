

export function formatPriceWithCurrency(domain: string, price: string): string | null {
    const currencySymbol = getCurrencySymbol(domain); 
  
    if (currencySymbol) {
      // Format the price with the currency symbol
      return `${currencySymbol}${price}`;
    } else {
      // Return null if the currency symbol is not found for the domain
      return null; 
    }
  }
  


export function getCurrencySymbol(domain: string): string | null {
    // Define a mapping of domains to currency symbols
    const domainCurrencyMap: { [key: string]: string } = {
      'com': '$',        // United States
      'es': '€',        // Spain
      'co.uk': '£',     // United Kingdom
      'de': '€',        // Germany
      'fr': '€',        // France
      'it': '€',        // Italy
      'ca': '$',        // Canada 
      'jp': '¥',        // Japan
      'in': '₹',        // India
      'au': '$',        // Australia
      // Add more mappings for other domains as needed
    };
  
    // Return the currency symbol if found in the map, otherwise return null
    return domainCurrencyMap[domain] || null;
  }