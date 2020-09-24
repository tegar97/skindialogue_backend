const express = require('express')
const router = express.Router()
const apiController = require('./../controller/apiController')

router.get('/artikel',apiController.artikelApi)
router.get('/artikel/:slug',apiController.detailArtikel)



router.get('/category',apiController.categoryApi)
router.get('/category/:slug',apiController.detailCategory)





module.exports = router