const { default: mongoose, Schema } = require("mongoose");


const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Student'],
        default: 'Student'
    }
})

module.exports = mongoose.model('Users', schema, 'users')