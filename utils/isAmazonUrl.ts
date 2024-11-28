export function isAmazonUrl(productUrl: string): boolean {
    // Use a regular expression to check if the URL starts with "https://www.amazon.com/"
    const amazonUrlPattern = /^https:\/\/www\.amazon\.com\//;
    return amazonUrlPattern.test(productUrl);
  }