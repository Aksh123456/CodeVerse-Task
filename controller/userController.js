const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');
const addressModel = require('../model/addressModel')




// Function to generate OTP 
function generateOTP() { 
  
    // Declare a digits variable 
    // which stores all digits  
    let digits = '0123456789'; 
    var OTP = ''
    let len = digits.length 
    for (let i = 0; i < 6; i++) { 
        OTP += digits[Math.floor(Math.random() * len)]; 
    } 
     
    return OTP; 
} 



exports.signUp = async (req, res) => {
    try {
      console.log(req.body,req.body.email,req.body.password,req.file, "body");
      const userFind = await userModel.findOne({
        email: req.body.email,
      });
      if (userFind) {
        return res.status(400).json({
          status: false,
          message: "User email already exists",
          data: {}
        });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      // console.log(hashedPassword, "hashedPassword");
      const otp = generateOTP();
      console.log(otp, 'otp')
      const userSaved = await userModel.create({
        name: req.body.name,
        age: req.body.age,
        phone_number: req.body.phone_number,
        email: req.body.email,
        password: hashedPassword,
        profile_pic: req.file.originalname,
        otp: otp
      });
  
      if (userSaved) {
        return res.status(201).json({
          message: "user Created Successfully",
          status: true,
          data: otp
        });
      }
    } catch (err) {
      console.log(err, 'error')
      return res.status(500).json({
        message: "Internal Server Error",
        status: false,
        data: {} 
      });
    }
  };


  
exports.login = async (req, res) => {
    try {
    //   console.log(req.body,req.body.email,req.body.password,req.file, "body");
    console.log(req.body, 'req.body')
      const userFind = await userModel.findOne({
        phone_number: req.body.phone_number,
      });
      console.log(userFind, 'find')
      if (!userFind) {
        return res.status(400).json({
          status: false,
          message: "User does not exists",
          data: {}
        });
      }
      
    //   const matchOtp = userModel.findOne({
    //     // phone_number: req.body.phone_number,
    //     otp: req.body.otp
    //   })

    //   console.log(matchOtp, 'matchOpt')
      
      if (req.body.otp == userFind.otp) {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
          userId: userFind._id,
          email: userFind.email,
          role: userFind.role

        };
  
        const token = jwt.sign(data, jwtSecretKey, { expiresIn: "60m" });
        const userUpdate = await userModel.findByIdAndUpdate({_id: userFind._id}, {
            $set: {
                otp : ""
            }
        })
        // console.log
        userUpdate.password = "";
        userUpdate.profile_pic = userUpdate.profile_pic ? 'http://localhost:3000/' + userUpdate.profile_pic: ""

        const userData = {...userUpdate._doc, token};
        return res.status(201).json({
            message: "user Login Successfully",
            status: true,
            data: userData,
          });
    
    }
    else 
    {
        return res.status(400).json({
            message: "user otp is not correct",
            status: false,
            data: {},
          }); 
    }
} catch (err) {
      console.log(err, 'error')
      return res.status(500).json({
        message: "Internal Server Error",
        status: false,
        data: {} 
      });
    }
  };


exports.createAddress = async (req, res) => {
  try {
    console.log(req.body, req.file, "body");
    const userFind = await addressModel.findOne({
      street: req.body.street,
      state: req.body.state,
      user_id : req.user.userId

    });
    if (userFind) {
      return res.status(400).json({
        status: false,
        message: "Address already exists",
        data: {},
      });
    }

    const userSaved = await addressModel.create({
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      user_id: req.user.userId
    });

    if (userSaved) {
      return res.status(201).json({
        message: "Address Created Successfully",
        status: true,
        data: userSaved,
      });
    }
  } catch (err) {
    console.log(err, "error");
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
      data: {},
    });
  }
};

