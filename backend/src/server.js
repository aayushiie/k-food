import express from 'express'
import path from 'path'
import { ENV } from './config/env.js'
import { connectDB } from './config/db.js'
import { clerkMiddleware } from '@clerk/express'
import {serve} from "inngest/express"
import {functions, inngest} from "./config/inngest.js"
import cors from "cors"

import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import reviewRoutes from "./routes/review.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";



const app = express()

const __dirname = path.resolve()

app.use(express.json())

app.use("/api/inngest", serve({client:inngest, functions:functions}))

app.use(clerkMiddleware()) // adds auth object under req => req.auth

app.use(cors({origin:ENV.CLIENT_URL, credentials: true})) // credentials: true allows the browser to send the cookies to the server with the request

app.use("/api/admin", adminRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)

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