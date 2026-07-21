const app=require('./app')
const dotenv=require('dotenv');
const mongodb=require('./config/db')
const employeeRouter=require("./routes/employee.routes")
dotenv.config()
const port=process.env.PORT || 7001
mongodb();
app.use("api/employee",employeeRouter)
app.listen(port,()=>{
console.log(`... Employee Managemnt service is listening to port: ${port} ...`)
});