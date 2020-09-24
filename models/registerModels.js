const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    registerResetToken : String,
    registerResetExpire : Date,
    email: String,
    roles: String

})

const register = mongoose.model('register',registerSchema)

module.exports = register