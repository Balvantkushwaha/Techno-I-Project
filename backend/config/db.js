import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Technoii");
        console.log("✅ MongoDB Connected");
        
    } catch (err) {
        console.error("❌ DB Connection Error:", err.message);
        process.exit(1); // Exit process with failure
    }
};
   
export default connectDB;   
