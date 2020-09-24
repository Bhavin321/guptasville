const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
    
    room:{
        type:Number
    },
    
    availability:{
        type: Number
    },

    dates:{
        type:Array
    }

})

  
module.exports = mongoose.model('hotel_data', hotelSchema)