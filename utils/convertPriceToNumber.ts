export function convertPriceToNumber(price: string): number {
    // Replace commas with periods to handle European-style decimal separators
    const normalizedPrice = price.replace(",", ".");
    
    // Convert the string to a number
    const numberPrice = parseFloat(normalizedPrice);
  
    // Check if the conversion was successful
    if (isNaN(numberPrice)) {
      return 0.00; 
    }
  
    return numberPrice;
  }