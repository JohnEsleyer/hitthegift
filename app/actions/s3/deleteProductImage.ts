"use server";

import { s3 } from "@/lib/s3";

export default async function deleteProductImage(productId: string) {
  try {
    const fileName = `${productId}.webp`;

    // Parameters for deleting from DigitalOcean Space
    const params = {
      Bucket: "products-hitmygift",
      Key: fileName,
    };

    // Delete the file from the space
    await s3.deleteObject(params).promise();

    return { success: true };
  } catch (e: any) {
    console.error("Error deleting product image:", e);
    return { success: false, error: e.message };
  }
}
