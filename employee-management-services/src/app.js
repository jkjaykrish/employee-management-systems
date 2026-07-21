const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const hetmet=require('helmet');
const dotenv=require('dotenv');
const employeeRouter=require("./routes/employee.routes")

dotenv.config();

const app=express();
app.use(express.json());
app.use("/api/employee",employeeRouter)
app.use(cors());
app.use(morgan("dev"));
app.use(hetmet());
app.get('/',(req,res)=>{
    return res.send(`Employee Management Api is Working `);
})
module.exports=app;