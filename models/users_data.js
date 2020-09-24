const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    
    name:{
        type:String
    },
   
    email: {
      type: String
    },

    
    contact:{
        type:Number
    },


    password: {
      type: String
    },

  })

  
module.exports = mongoose.model('user_data', userSchema)