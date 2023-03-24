const app = require('express')();
const PORT = 5000;
const mongoose = require('mongoose');
const eventRoutes = require('./routes/events')
const dotenv = require('dotenv');

dotenv.config();


mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('connected to mongodb')
}).catch((err)=>{
    console.error(err)
})

app.use('/v1/events', eventRoutes)


app.listen(PORT,()=>{
    console.log('listening on port', PORT)
})