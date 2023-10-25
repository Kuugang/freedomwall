const mongoose = require("mongoose")

const appSchema = mongoose.Schema({
    codeName: {
        type: String,
        maxlength: 100,
        required: true
    },
    message: {
        type: String,
        maxlength: 1000,
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

module.exports = mongoose.model('test', appSchema)