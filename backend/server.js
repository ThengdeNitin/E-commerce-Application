import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongoDB.js'
import userRouter from './routes/userroutes.js';
import productRouter from './routes/productroute.js';
import orderRouter from './routes/orderroutes.js';

const app = express();
const PORT = process.env.PORT || 4000

connectDB().catch(err => {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
});

app.use(express.json());
app.use(cors());

app.use('/api/user', userRouter);
app.use('/api/posts', productRouter);
app.use('/api/order', orderRouter);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

