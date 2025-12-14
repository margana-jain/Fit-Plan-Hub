const express = require('express')
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser')
const notFound = require('./middleware/not-found')
const authRoute = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const followRoutes = require('./routes/followRoute');
const connect = require('./config/connectDB');
const planRoutes = require('./routes/planRoutes');
const cors = require('cors');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.use(cors({
  origin: process.env.URL,
}));



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());


  
//routes
app.use('/api/auth',authRoute);
app.use('/api/plans',planRoutes);
app.use('/api/subscriptions',subscriptionRoutes);
app.use('/api/follow', followRoutes);

app.use(notFound);
app.use(errorHandlerMiddleware);



const port = process.env.PORT || 3000

const start = async () => {
    try {
        await connect(process.env.MONGO_URI)
        app.listen(port , ()=>{
            console.log(`CONNECTED TO THE DB ... AT PORT ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()