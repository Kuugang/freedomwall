const mongoose = require("mongoose")

const appSchema = mongoose.Schema({
    codeName: {
        type: String,
        required: true
    },
    message: {
        type: String,
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