'use server'

import { s3 } from "@/lib/s3";
import sharp from "sharp"; // Import sharp for image processing

// Function to handle profile upload with image cropping
// Image file is named through a uuid generator, which is set in the file name at client side.
// Image file can't be named as productId because the creation of image is done before the product record.
export default async function uploadProfile(formData: FormData) {
  try {
    // Extract file from formData
    const file = formData.get('file') as File;

    if (!file) {
      throw new Error('Missing file or userId in formData');
    }

    // Use userId as the folder name
    const fileName = file.name;

    // Convert file into a Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Use sharp to crop the image to a 1:1 ratio (square) before uploading
    const croppedImageBuffer = await sharp(fileBuffer)
      .resize({
        width: 500,  // Example width (you can adjust this)
        height: 500, // Example height (should be the same as width to maintain 1:1 ratio)
        fit: sharp.fit.cover, // Ensure the image covers the dimensions
      })
      .toBuffer();

    // Parameters for uploading to DigitalOcean Space
    const params = {
      Bucket: 'products-hitmygift', // Replace with your actual DigitalOcean Space name
      Key: fileName, // Use the generated file name with userId as the folder
      Body: croppedImageBuffer, // Use the cropped buffer containing file data
      ACL: 'public-read', // Make it public, or use 'private' for restricted access
    };

    // Upload the file to the space
    const data = await s3.upload(params).promise();

    // Return the URL of the uploaded file
    return { success: true, url: data.Location };

  } catch (e: any) {
    console.error('Error uploading profile:', e);
    return { success: false, error: e.message };
  }
}
