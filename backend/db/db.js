import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {

    try{
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongodb connection");
        

    }catch(e){
        console.error(e);
        process.exit(1);
    }
    
}

export default connectDB;