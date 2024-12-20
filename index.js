const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

const connectDB = require('./config/dbConfig');
const userRoutes = require('./route/userRoutes');
const adminRoutes = require('./route/adminRoutes');

const userModel = require('./model/userModel');

const app = express();
app.use(express.json());
app.use(express.static('uploads'));

dotenv.config();

connectDB();

async function  createAdmin()
{
          const hashedPassword = await bcrypt.hash('123456', 10);
    const adminFind = await userModel.findOne({
        email: 'admin@gmail.com'
    })
    if(!adminFind)
    {
        const createAdmin =  await userModel.create({
            name: "admin",
            age: 22,
            phone_number: 4646484248,
            email: 'admin@gmail.com',
            password: hashedPassword,
            // profile_pic: req.file.originalname,
            // otp: otp
            role: 'admin'
          });
    }
   
}

createAdmin();

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);


app.listen(process.env.PORT , ()=>{
    console.log(`server is listening on port ${process.env.PORT}`)
})