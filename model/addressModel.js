const mongoose = require('mongoose');
// const User = require('./userModel')

const addressModel = new mongoose.Schema({
   user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
     },
     street: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },  
},
{timestamps : true}
);



module.exports = mongoose.model("Address", addressModel);