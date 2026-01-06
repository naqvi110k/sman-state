import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv"
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO).then(()=>{
    console.log('Connected to MongoDB...');
}).catch(err=>{
    console.error('Error connecting to MongoDB:',err);}
)

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// Error handling middleware
app.use ((err, req, res, next) => {
    const statuscode = err.statuscode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statuscode).json({
        success : false,
        statuscode,
        message,
    })
})

export default app;
