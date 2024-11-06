'use server'

import axios from 'axios';
import * as cheerio from 'cheerio';

interface ProductDetails{
  title: string;
  price: string;
  description: string;
  imageUrl: string;
}

function extractPrice(text: string): string {
  // Remove leading '$' characters
  const cleanedText = text.replace(/^\$+/, ''); 

  // Split the string by '.'
  const parts = cleanedText.split('.');

  // Extract the whole and fractional parts
  const wholePart = parts[0]; 
  const fractionalPart = parts[parts.length - 1].substring(0, 2); // Take first 2 digits

  // Construct the final price string
  return `$${wholePart}.${fractionalPart}`; 
}


export default async function getProductDetails(asin: string) {
  try {
      // Fetch the page HTML
      const { data } = await axios.get(`https://www.amazon.com/dp/${asin}`);
      // Load HTML into cheerio
      const $ = cheerio.load(data);

      // Select the elements and extract text or attribute values
      const title = $('#productTitle').text().trim();
      const priceWhole = $('.a-price .a-price-whole').text().trim();
      const priceFraction = $('.a-price .a-price-fraction').text().trim();
      const priceSymbol = $('.a-price-symbol').text().trim();
      const price = extractPrice(`${priceSymbol}${priceWhole}.${priceFraction}`);

      // Try to fetch the product description from multiple locations
      let description = $('#productDescription').text().trim();

      // Alternative selector for description (feature bullets)
      if (!description) {
          description = $('#feature-bullets .a-list-item')
              .map((i, el) => $(el).text().trim())
              .get()
              .join(' ');
      }

      // Fallback to meta description if other options fail
      if (!description) {
          description = $('meta[name="description"]').attr('content') || '';
      }
      // Get the main image URL
      const imageUrl = $('#landingImage').attr('src') || '';

    
      console.log(`price: ${price}`);
    return {
      title,
      price,
      description,
      imageUrl
    } as ProductDetails;
  } catch (error) {
    console.error("Error scraping product data:", error);
    return null;
  }
}
