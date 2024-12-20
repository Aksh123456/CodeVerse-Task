const mongoose = require('mongoose');


const cartModel = new mongoose.Schema({
   user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
     },
   
     book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
     },
    
},
{timestamps : true}
)


module.exports = mongoose.model("Cart", cartModel);