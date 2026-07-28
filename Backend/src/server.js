
import cors from "cors"
import dotenv from "dotenv";
import express from 'express';
import path from "path"
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from './middleware/rateLimiter.js';


dotenv.config();
const Port = process.env.PORT || 5001;
const __dirname = path.resolve()
const app = express();




// ?middle layer 
if(process.env.NODE_ENV!=="production"){
    app.use(cors(
    {
        origin:"http://localhost:5173"
    }
    ))
}

app.use(express.json()) //this middleware parses the json bodies 
app.use(rateLimiter)

app.use("/api/notes", notesRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../Frontend/dist")))
    app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../Frontend","dist","index.html"))
})
}

connectDB().then(()=>{
    app.listen(Port, () => {
        console.log(`Server is running on port ${Port}`);
    });
})





