const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const DATABASE_URL = process.env.MONGO_URI;

mongoose.connect(DATABASE_URL).then(()=>{
    console.log("Database connection is established")
}).catch((error)=>{
    console.log("Error while connecting databse",error)
})
 
