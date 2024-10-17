'use server'

import { ProductType } from "@/lib/types/products";
import mongoose from "mongoose";

// Define the product schema if not already defined
const productSchema = new mongoose.Schema({
    userId: String,
    title: String,
    productUrl: String,
    price: String,
    imageUrl: String,
    description: String,
});

// Create a model for the product
const Product = mongoose.model<ProductType>("Product", productSchema);

// Function to get a random product by userId
export default async function getRandomUserProduct(userId: string) {
    try {
        // Fetch all products of the user
        const userProducts = await Product.find({ userId });

        if (userProducts.length > 0) {
            // Get a random product from the user's products
            const randomIndex = Math.floor(Math.random() * userProducts.length);
            const randomProduct = userProducts[randomIndex];

            return {
                status: 200,
                data: randomProduct,
            };
        } else {
            return {
                status: 404,
                message: "No products found for the given user.",
            };
        }
    } catch (error) {
        console.error("Error fetching random product:", error);
        return {
            status: 500,
            message: "Internal server error.",
        };
    }
}
