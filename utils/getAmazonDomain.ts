'use client'

export function getAmazonDomain(productUrl: string): string | null {
    try {
      // Use the URL constructor to parse the URL
      const url = new URL(productUrl);
  
      // Extract the hostname (e.g., www.amazon.es)
      const hostname = url.hostname;
  
      // Split the hostname by dots
      const parts = hostname.split('.');
  
      // Check if the hostname is a valid Amazon domain
      if (parts.length >= 2 && parts[1] === 'amazon') {
        // Return the top-level domain (e.g., es, com)
        return parts[2];
      } else {
        // Not a valid Amazon domain
        return null;
      }
    } catch (error) {
      console.error('Invalid URL:', error);
      return null;
    }
}