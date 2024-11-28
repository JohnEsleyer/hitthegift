'use server'

import axios from 'axios';
import * as cheerio from 'cheerio';

interface ProductDetails {
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
  return `${wholePart}.${fractionalPart}`;
}

function extractPrice2(str: string): string | null {
  const match = str.match(/(?:\$|€)?(\d+[\.,]\d{2})(?:\$|€)?/);
  return match ? match[1] : null;
}

export default async function getProductDetails(asin: string, domain = 'com') {
  let attempts = 0;
  const maxAttempts = 10; 

  while (attempts < maxAttempts) {
    try {
      // Construct the Amazon URL based on the provided domain
      const url = `https://www.amazon.${domain}/dp/${asin}`;

      // Fetch the page HTML
      const { data } = await axios.get(url);

      // Load HTML into cheerio
      const $ = cheerio.load(data);

      // Select the elements and extract text or attribute values
      const title = $('#productTitle').text().trim();

      const price = extractPrice2($('.a-offscreen').text().trim());

      console.log(`title: ${title}`);
      console.log(`price: ${price}`);

      let description = $('#productDescription').text().trim();

      if (!description) {
        description = $('#feature-bullets .a-list-item')
          .map((i, el) => $(el).text().trim())
          .get()
          .join(' ');
      }

      if (!description) {
        description = $('meta[name="description"]').attr('content') || '';
      }

      const imageUrl = $('#landingImage').attr('src') || $('#imgBlkFront').attr('src') || '';

      return {
        title,
        price,
        description,
        imageUrl
      } as ProductDetails;

    } catch (error) {
      console.error("Error scraping product data:", error);
      attempts++;
      if (attempts < maxAttempts) {
        console.log(`Retrying in 2 seconds (attempt ${attempts + 1} of ${maxAttempts})...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); 
      }
    }
  }

  console.error(`Failed to scrape product data after ${maxAttempts} attempts.`);
  return null; 
}