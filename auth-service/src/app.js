const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const hetmet=require('helmet');
const dotenv=require('dotenv');

dotenv.config();

const app=express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(hetmet());
app.get('/',(req,res)=>{
    return res.send(`Auth Api is Working`);
})
module.exports=app;