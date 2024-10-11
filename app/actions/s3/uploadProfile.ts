'use server'

import { s3 } from "@/lib/s3";

// Function to handle profile upload
export default async function uploadProfile(formData: FormData, userId: string) {
  try {
    // Extract file from formData
    const file = formData.get('file') as File;

    if (!file || !userId) {
      throw new Error('Missing file or userId in formData');
    }

    // Use userId as the folder name
    const fileName = file.name;
    
    // Convert file into a Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Parameters for uploading to DigitalOcean Space
    const params = {
      Bucket: 'profile-hitmygift', // Replace with your actual DigitalOcean Space name
      Key: fileName, // Use the generated file name with userId as the folder
      Body: fileBuffer, // Use the buffer containing file data
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