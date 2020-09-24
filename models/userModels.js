const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name :{ 
        type: String,
        required: [true,'Nama wajib di isi !!']
    },
    email : {
        type : String,
        required : [true,'Please provide your email'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail]
    },
    photo : {
        type : String,
        default : 'default.jpg'
    },
    role : {
        type : String,
        enum : ['penulis','admin'],
        default : 'admin'
    
    
    },
    password : {
        type : String,
        required : [true,'please provide a password'],
        minLength : 8,
        select : false
    },
    passwordConfirm : {
        type : String,
        required : [true,'please confirm  your  password'],
        validate  :{
            validator : function(el) {
                return el === this.password
            },
            message : 'Password tidak sama '
        },
        select : false
    },
    passwordChangeAt : Date,


})

userSchema.pre('save',async function(req,res,next) {
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password,12)

    this.passwordConfirm = undefined


    next()
})

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangeAt) {
        const changeTimeStamp = parseInt(this.passwordChangeAt.getTime() / 1000,10)
        // console.log(changeTimeStamp,JWTTimestamp);
        return JWTTimestamp < changeTimeStamp

    }


}
userSchema.methods.correctPassword = async function(
    cadidatepassword,
    userPassword
){
     return await bcrypt.compare(cadidatepassword,userPassword) 
  
    
}
const user = mongoose.model('user',userSchema)

module.exports = user