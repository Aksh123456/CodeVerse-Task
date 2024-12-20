const mongoose = require('mongoose');

module.exports  = async function connectDB()
 {
    
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/bookDB')
            console.log('Db Connected Successfully')
        }
        catch (err) {
            console.log(err, 'error')
        }
    
    
}