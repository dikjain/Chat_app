import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {

    try{
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`[${new Date().toISOString()}] INFO: MongoDB connected successfully`);
        

    }catch(e){
        console.error(`[${new Date().toISOString()}] ERROR: MongoDB connection failed:`, e.message);
        process.exit(1);
    }
    
}

export default connectDB;