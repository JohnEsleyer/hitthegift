'use server'

import { MongoClient, ObjectId } from "mongodb";

// Used by the client to create ObjectId in string format.
export async function createObjectId(){
    const strObjectId = new ObjectId();
    return strObjectId.toString();
}

export async function deleteAllUsers(){
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try{
        mongoClient.db('hitmygift').collection('users').deleteMany({});
    }catch(e){
        console.log(e);
    }finally{
        mongoClient.close();
    }
}

// Adds a new field to the products collection
export async function addFieldToProducts(newField: string, defaultValue: any) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
      const db = mongoClient.db('hitmygift');
      const productsCollection = db.collection('products');
  
      // Use updateMany to add the new field to all documents
      const result = await productsCollection.updateMany(
        {}, // Match all documents
        { $set: { [newField]: defaultValue } } 
      );
      console.log(`Added field "${newField}" to ${result.modifiedCount} products`);
      return { message: "Field addition successful", status: 200 };
    } catch (e) {
      console.error("Error adding field to products:", e);
      return { message: "Field addition failed", status: 500 };
    } finally {
      mongoClient.close();
    }
}

// Adds a new field to the products collection
export async function addFieldToUsers(newField: string, defaultValue: any) {
  const uri = process.env.MONGODB_URI || '';
  const mongoClient = new MongoClient(uri);
  try {
    const db = mongoClient.db('hitmygift');
    const productsCollection = db.collection('users');

    // Use updateMany to add the new field to all documents
    const result = await productsCollection.updateMany(
      {}, // Match all documents
      { $set: { [newField]: defaultValue } } 
    );
    console.log(`Added field "${newField}" to ${result.modifiedCount} users`);
    return { message: "Field addition successful", status: 200 };
  } catch (e) {
    console.error("Error adding field to products:", e);
    return { message: "Field addition failed", status: 500 };
  } finally {
    mongoClient.close();
  }
}

// Deletes a field from the products collection
export async function deleteFieldFromProducts(fieldToDelete: string) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
      const db = mongoClient.db('hitmygift');
      const productsCollection = db.collection('products');
  
      // Use updateMany to remove the field from all documents
      const result = await productsCollection.updateMany(
        {}, // Match all documents
        { $unset: { [fieldToDelete]: "" } } 
      );
      console.log(`Deleted field "${fieldToDelete}" from ${result.modifiedCount} products`);
      return { message: "Field deletion successful", status: 200 };
    } catch (e) {
      console.error("Error deleting field from products:", e);
      return { message: "Field deletion failed", status: 500 };
    } finally {
      mongoClient.close();
    }
}

// Updates the value of a field for all documents in the products collection
export async function updateFieldValueInProducts(fieldToUpdate: string, newValue: any) {
  const uri = process.env.MONGODB_URI || '';
  const mongoClient = new MongoClient(uri);
  try {
    const db = mongoClient.db('hitmygift');
    const productsCollection = db.collection('products');

    // Use updateMany to update the field in all documents
    const result = await productsCollection.updateMany(
      {}, // Match all documents
      { $set: { [fieldToUpdate]: newValue } } 
    );
    console.log(`Updated field "${fieldToUpdate}" to "${newValue}" in ${result.modifiedCount} products`);
    return { message: "Field update successful", status: 200 };
  } catch (e) {
    console.error("Error updating field value in products:", e);
    return { message: "Field update failed", status: 500 };
  } finally {
    mongoClient.close();
  }
}