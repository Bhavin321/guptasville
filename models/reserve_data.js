const mongoose = require('mongoose')

const reserveSchema = new mongoose.Schema({
    
    first:{
        type:String
    },

    last:{
        type:String
    },
    
    contact:{
        type: Number
    },

    email: {
      type: String
    },

    room:{
        type:Number
    },
    
    adults:{
        type:Number
    },

    children:{
        type:Number
    },

    arrival: {
      type: Date
    },

    departure: {
        type: Date
      },

})

  
module.exports = mongoose.model('reserve_data', reserveSchema)