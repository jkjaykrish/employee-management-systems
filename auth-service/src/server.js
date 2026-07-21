const app=require('./app')
const dotenv=require('dotenv');
const mongodb=require('./config/db')
dotenv.config()
const port=process.env.PORT || 7001
mongodb();
app.listen(port,()=>{
console.log(`... auth is listening to port: ${port} ...`)
});