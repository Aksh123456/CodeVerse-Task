const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    book_name: {
        type: String,
        require: true
    },
    author_name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    book_pic: {
        type: String,
        require: true
    }
    
},
{timestamps : true}
)



module.exports = mongoose.model("Book", bookSchema);