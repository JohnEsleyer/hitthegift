import { connectToMongoDB } from "./mongodb";


const db = connectToMongoDB();
db.then((value)=>{
    console.log(value.db?.databaseName)
})