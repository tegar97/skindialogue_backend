const express = require('express')
const router = express.Router()
const dasboardController = require('../controller/dasboardController')
const categoryController = require('../controller/categoryController')
const artikelController = require('../controller/artikelController')
const accountManamentController = require('../controller/accountManamentController')
const authController = require('./../controller/authController')
const templateController = require('./../controller/templateController')
const rateLimit = require('express-rate-limit')

var csrf = require('csurf')
// setup route middlewares
var csrfProtection = csrf({ cookie: true })
const multer = require('./../middleware/multer')
const { Router } = require('express')


//limit 
const limiter2 = rateLimit ({
    max : 100,
    windowMs : 15 * 60 * 1000,
    message : 'Demi Menjaga Keamanan System , Kami memblokir sementara ip anda , karena salah memasukan data akun lebih dari 7x .Tunggu 15 menit lagi untuk login kembali'
  })
router.get('/',limiter2,authController.LoginPage)
router.post('/',limiter2,authController.login)
router.get('/register/:token',csrfProtection,authController.registerPage)
router.post('/register/:token',authController.RegisterAction)


// Protetect all after this middleware


//logout
router.get('/logout',authController.protect,authController.logout)
//
router.get('/dasboard',authController.protect,dasboardController.index)

//kategori
router.get('/category',authController.protect,categoryController.index)
router.post('/category',authController.protect,categoryController.addCategory)
router.put('/category/',authController.protect,categoryController.editCategory)
router.delete('/category/:id',authController.protect,categoryController.deleteCategory)


//Artikel

router.get('/artikel',authController.protect,artikelController.index)
router.get('/artikel/create',authController.protect,artikelController.create)
router.post('/artikel',authController.protect,multer.uploadThumbnail,multer.resizePhoto,artikelController.addArtikel)
router.delete('/artikel/:id',authController.protect,artikelController.deleteArtikel)
router.get('/artikel/edit/:id',authController.protect,artikelController.editArtikel)
router.patch('/artikel/:id',authController.protect,multer.uploadThumbnail,multer.resizePhoto,artikelController.updateArtikel)


router.get('/user',authController.protect,authController.restrictTo('admin'),accountManamentController.index)
router.patch('/user',authController.protect,authController.restrictTo('admin'),accountManamentController.changeRole)
router.delete('/user/:id',authController.protect,authController.restrictTo('admin'),accountManamentController.deleteUser)

router.post('/generetePage',authController.protect,authController.restrictTo('admin'),authController.generatePage)
router.get('/getToken',authController.protect,authController.restrictTo('admin'),authController.getToken)

router.get('/template/edit/navbar',templateController.navbar)


module.exports = router