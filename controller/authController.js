
const RegisterCode = require('./../models/registerModels')
const crypto = require('crypto')
const User = require('./../models/userModels')
const jwt = require('jsonwebtoken')
const showAlert = './../views/partials/alert'
const catchAsync = require('../utils/catchAsync')
const AppError = require('./../utils/appError')
const Email = require('../utils/email')
const {promisify} = require('util')
var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })

const signToken = id => {
    return jwt.sign({id},'saya-adalah-seorang-pelajar-dan-anaks',{
        expiresIn : '1D'
    })
}
const createSendToken = (user,statusCode,res) =>{
   
    const token = signToken(user._id)
    const cookieOptions = {
        expires : new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 *60 *60 *1000
        ),
        httpOnly : true

    }
    // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt',token,cookieOptions)
    

}
exports.generatePage = catchAsync(async(req,res) =>{
    const {code,roles,email,registerResetExpire} = req.body
    console.log(registerResetExpire)

  
    let codeEncrypt = crypto
                    .createHash('sha256')
                    .update(code)
                    .digest('hex')
    
    if(!email) {
        await RegisterCode.create({
            registerResetToken: codeEncrypt,
            registerResetExpire: registerResetExpire ? Date.now() + registerResetExpire * 60 * 1000 : Date.now() + 10 * 60 * 1000 ,
            roles : roles
        })
        
    }else{
        const  RegisterData = await RegisterCode.create({
            registerResetToken: codeEncrypt,
            registerResetExpire: registerResetExpire ?  Date.now() + registerResetExpire   * 60 * 1000 : Date.now() + 10 * 60 * 1000 , 
            email: email,
            roles : roles
        })
        const url = `${req.protocol}://${req.get('host')}/register/${code}`

        await new Email(RegisterData,url).sendInviteLink()

    }
})

exports.registerPage = catchAsync(async(req,res) =>{

    const ParamsToken = req.params.token
    const roles = req.body
    const hashedToken = crypto 
                        .createHash('sha256')
                        .update(req.params.token)
                        .digest('hex')
    

    const user = await RegisterCode.findOne({registerResetToken: hashedToken,registerResetExpire: {$gt: Date.now()}}).select('roles registerResetToken registerResetExpire')
    
    if(!user) {
        return res.redirect('/')
    }
    console.log(user)
    res.status(200).render('admin/user/register',{
        title : ` Register`,
        ParamsToken,
        user,
        csrfToken: req.csrfToken()
        
    })
    await new Email(newUser).sendWelcome()

})
exports.RegisterAction = catchAsync(async(req,res) =>{
   

        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

        const user = await RegisterCode.findOne({registerResetToken: hashedToken,registerResetExpire: {$gt: Date.now()}}).select('roles registerResetToken registerResetExpire')

        if(!user) {
            return res.redirect('/')
        }
        console.log(user.roles)
        const newUser = await  User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            role : user.roles,
            passwordConfirm : req.body.passwordConfirm,
            
        })
        user.remove()

        await new Email(newUser).sendWelcome()

        createSendToken(newUser,201,res)
        res.redirect('/dasboard')
    }
)

exports.protect = catchAsync( async(req,res,next) =>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {
        token = req.headers.authorization.split(' ')[1]
    }else if(req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
        token = req.cookies.jwt
    }
 
  
    if(!token) {
        return res.redirect('/')
    }

    const decoded = await promisify(jwt.verify)(token,'saya-adalah-seorang-pelajar-dan-anaks')

    //cek users still exist or not 

    const currentUser =  await User.findById(decoded.id)
    if(!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist',401))
    }

    if(currentUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError('user recently change password! ,please log in again',401 ))
    }
     
    req.user = currentUser
    res.locals.user = currentUser;
    next()

})

//login

exports.LoginPage = catchAsync(async(req,res) => {
    const alertMessage = req.flash('alertMessage')
    const alertStatus = req.flash('alertStatus')
    const alert = {message: alertMessage,status: alertStatus}
    res.status(200).render('admin/user/login',{
        title : ` Login`,
        alert
        
        
    })
})

exports.login = async(req,res,next) =>{
    try {
            const {email,password} = req.body 

        if(!email || !password) {
            req.flash('alertMessage',`Masukan Password dan email`)
            req.flash('alertStatus','danger')
            res.redirect('/')
        }
        const user = await User.findOne({email}).select('password')
        if(!user) {
            req.flash('alertMessage',`User tidak ditemukan`)
            req.flash('alertStatus','danger')
            res.redirect('/')
        }
        const correct = await user.correctPassword(password,user.password)
    
        if(!correct) {
            req.flash('alertMessage',`Password salah`)
            req.flash('alertStatus','danger')
            res.redirect('/')
        }
        
        createSendToken(user,200,res)

        res.redirect('/dasboard')
    }catch(error) {
        req.flash('alertMessage',`${error.message} `)
        req.flash('alertStatus','danger')
        res.redirect('/')
    }
}
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    req.flash('alertMessage',`Berhasil Logout`)
    req.flash('alertStatus','success')
    res.redirect('/')

 
  };


exports.getToken = async(req,res,next) =>{
    const user = req.user;
    console.log(user)
    createSendToken(user,200,res)
    next()

}

exports.restrictTo = (...role) =>{
    return(req,res,next) =>{
        if(!role.includes(req.user.role)) {
            return res.redirect('/dasboard')
        }next()
    }
}