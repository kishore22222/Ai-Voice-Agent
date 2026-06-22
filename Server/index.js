import express from "express"
import dotenv from "dotenv"
import connectDB from "./Configs/ConnectDB.js";
import authRouter from "./Routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./Routes/user.route.js";
import assistantRouter from "./Routes/assistant.route.js";
import { getAssistantConfig } from "./Controllers/assistant.controller.js"
import billingRouter from "./Routes/billing.route.js";
dotenv.config();


const app = express()
app.use(express.json())
app.use(cookieParser())
const privateCors = cors({
    origin:[
        "https://shifra-d82z.onrender.com"
    ],
    credentials:true
});
const publicCors = cors({

    origin:"*"
});



app.get("/",(req,res)=>{
    res.send("hello from server")
})
app.use("/api/auth",privateCors,authRouter)
app.use("/api/user",privateCors,userRouter)
app.use("/api/billing",privateCors,billingRouter)

app.use("/api/assistant",publicCors,assistantRouter)
const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`server started on port  ${PORT}`);
    connectDB()
    
})
