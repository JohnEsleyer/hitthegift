
// Function to extract ASIN (Amazon Standard Identification Number)
export const extractASIN = (url: string): string | null => {
    const match = url.match(/\/dp\/([A-Z0-9]{10})(\/|\?|$)/);
    return match ? match[1] : null;
  };