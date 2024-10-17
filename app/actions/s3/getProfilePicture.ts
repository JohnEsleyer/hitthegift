'use server'

import { s3 } from "@/lib/s3"; // Adjust the import path based on your project structure

export async function getProfilePicture(userId: string) {
  const bucketName = 'profile-hitmygift';

  try {
    if (!userId) {
      throw new Error('Missing userId');
    }

    // Parameters for checking the existence of the file
    const params = {
      Bucket: bucketName,
      Key: `${userId}.webp`, // Check for {userId}.jpeg
    };

    // Check if the object exists in the S3 bucket
    await s3.headObject(params).promise();

    // Construct the file URL since it exists
    const fileUrl = `https://${bucketName}.${process.env.SPACES_CDN_ENDPOINT}/${userId}.webp`;

    console.log(fileUrl);
    console.log('fetchProfilePicture: Success');
    return { success: true, status: 200, data: fileUrl };

  } catch (error: any) {
    console.log('fetchProfilePicture: Failed');
    if (error.code === 'NotFound') {
      console.error(`File not found: ${error.message}`);
      return { success: false, status: 404, error: 'File not found' }; // Return 404 status if file doesn't exist
    }

    console.error('Error fetching profile:', error);
    return { success: false, status: 500, error: error.message }; // Return 500 for other errors
  }
}
