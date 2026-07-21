const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const dbConnect = async (req, res) => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log(`... MongoDb Successfuly Connected ...`);
  } catch (error) {
    console.error("mongo db conection failed");
    return res.json({ message: "mongo db connection faild", success: false });
    process.exit();
  }
};
module.exports = dbConnect;
