import express from 'express'
import path from 'path'
import { ENV } from './config/env.js'
import { connectDB } from './config/db.js'
import { clerkMiddleware } from '@clerk/express'
import {serve} from "inngest/express"
import {functions, inngest} from "./config/inngest.js"

const app = express()

const __dirname = path.resolve()

app.use(express.json())
app.use(clerkMiddleware()) // adds auth object under req => req.auth

app.use("/api/inngest", serve({client:inngest, functions:functions}))

app.get('/api/health', (req, res)=>{
    res.status(200).json({message: "Success"})
})

// in production
// if (ENV.NODE_ENV === "production"){
//     app.use(express.static(path.join(__dirname, "../admin/dist")))
//     app.get("/{*any}", (req, res)=>{
//         res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"))
//     })
// }

if (process.env.NODE_ENV === "production") {
    // 1. Ensure you use 'process.env' instead of 'ENV'
    // 2. Adjust the path relative to where this specific file sits
    const distPath = path.resolve(__dirname, "../admin/dist");
    
    app.use(express.static(distPath));
    
    // Use '*' to catch all frontend routes for your Single Page App (SPA)
    app.get("/*splat", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    }); 
}

const startServer = async () =>{
    await connectDB();
    app.listen(ENV.PORT, () =>{
        console.log("Server is up and running");
    });
};

startServer();