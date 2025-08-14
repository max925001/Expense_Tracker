import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import cors from 'cors';
import morgan from 'morgan';
import connectToDb from './config/db.js';

config();
connectToDb()

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization','Cookie'],

}))

app.use('/uploads', express.static('uploads')); 

app.use(morgan('dev'));

 const url = "https://expense-tracker-ti1l.onrender.com/ping"
const interval = 300000;
function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      console.log("website reloded again");
    })
    .catch((error) => {
      console.error(`Error : ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);
app.use('/ping' ,(req,res) =>{
    res.send('/pong')
})
 
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
