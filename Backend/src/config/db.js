import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("Error connecting to MONOGODB", error);
        process.exit(1);
    }
};