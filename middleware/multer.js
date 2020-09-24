const multer = require('multer')
const multerStorage = multer.memoryStorage()
const crypto = require('crypto')
const sharp = require('sharp')
const multerFilter = (req,file,cb) =>{
    if(file.mimetype.startsWith('image')) {
        cb(null,true)
    }else{
        cb('error please upload image',400,false)
    }
}

const upload = multer({
    storage  : multerStorage,
    fileFilter : multerFilter
})

exports.uploadThumbnail = upload.single('image')

exports.resizePhoto = async(req,res,next) =>{
    try {
      
        console.log('yoo ')
        if(!req.file) return next();
        req.file.filename = `thubmnail-${Date.now()}-${crypto.randomBytes(12).toString('hex')}.jpeg`;
        await sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality : 90}).toFile(`public/img/thumbnail/${req.file.filename}`)
        next()

    } catch (error) {
        req.flash('alertMessage',`${error.message} `)
        req.flash('alertStatus','danger')
        res.redirect('/artikel')
    }
}