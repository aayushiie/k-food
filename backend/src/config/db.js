import mongoose from mongoose
import {ENV} from "./env.js"
// npm i mongoose@8.19.3

export const connectDB = async() =>{
    try{
       const conn = await mongoose.connect(ENV.DB_URL)
       console.log(`Connected to MONGODB: ${conn.connection.host}`)
    } catch (error){
        console.error("MONGODB connection error")
        process.exit(1) // exit code 1 means failure, 0 means success
    }
}