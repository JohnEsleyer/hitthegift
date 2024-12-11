export function formatPriceWithCurrency(domain: string, price: string): string | null {
  const currencySymbol = getCurrencySymbolByDomain(domain); 

  if (currencySymbol) {
    // Format the price with the currency symbol
    return `${currencySymbol}${price}`;
  } else {
    // Return null if the currency symbol is not found for the domain
    return null; 
  }
}


export function getCurrencySymbol(currencyCode: string): string {
  switch (currencyCode) {
    case "USD":
    case "AUD":
    case "CAD":
      return "$";
    case "EUR":
      return "€";
    case "JPY":
      return "¥";
    case "GBP":
      return "£";
    default:
      // If the currency code is not one of the expected values, 
      // return a fallback symbol or empty string
      return "";
  }
}

export function getCurrencySymbolByDomain(domain: string): string | null {
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


export function getCurrency(domain: string): string | null {
  // Define a mapping of domains to currency symbols
  const domainCurrencyMap: { [key: string]: string } = {
    'com': 'USD',        // United States
    'es': 'EUR',        // Spain
    'co.uk': 'GBP',     // United Kingdom
    'ca': 'CAD',        // Canada 
    'jp': 'JPY',        // Japan
    'au': 'AUD',        // Australia
    // Add more mappings for other domains as needed
  };

  // Return the currency symbol if found in the map, otherwise return null
  return domainCurrencyMap[domain] || null;
}
