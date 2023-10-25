const mongoose = require("mongoose")

const appSchema = mongoose.Schema({
    codeName: {
        type: String,
        maxLength: 100,
        required: true
    },
    message: {
        type: String,
        maxLength: 1000,
        required: true,
    },
    img : { 
        // contentType: String,
        // data: Buffer,
        type : String
    }
},{
    timestamps: true
})

module.exports = mongoose.model('messages', appSchema)