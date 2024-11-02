'use server'

import { ProductType } from "@/lib/types/products";
import { MongoClient } from "mongodb";


export async function getUserProducts(id: string) {

    const uri = process.env.MONGODB_URI || '';

    const mongoClient = new MongoClient(uri);
    try {
        const db = mongoClient.db('hitmygift');
        
        // Find products with matching userId
        const products = await db.collection<ProductType>('products').find({ userId: id }).toArray();
      
        console.log(`Length: ${products.length}`);
        console.log(`array: ${products}`);
        let responseData: ProductType[] = [];
        products.map((product) => {
          responseData.push({
            id: product._id.toString(),
            userId: product.userId,
            price: product.price,
            currency: product.currency,
            title: product.title,
            productUrl: product.productUrl,
            imageUrl: product.imageUrl,
            description: product.description,

          });
        });

        if (products.length > 0) {
          return {
            message: "Successfully fetched all products",
            data: responseData,  
            status: 200,
          };
        } else {
          return {
            message: "No products found for the given user",
            data: [],
            status: 404,
          };
        }
      } catch (e) {
        console.error(e);
        
        return {
          message: "Failed to fetch products",
          status: 500,
        };
      }finally{
        mongoClient.close();
      }
   
}

