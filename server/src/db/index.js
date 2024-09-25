import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async() => {
    try {
        console.log(`mongoose :- ${process.env.PORT}`);
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`MONGODB_CONNECTED`)
    } catch (error) {
        console.log(error)
    }
}

export default connectDB;