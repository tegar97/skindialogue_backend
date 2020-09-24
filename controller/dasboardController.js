const Category = require('./../models/categoryModels')
const Artikel = require('./../models/artikelModels')
const User = require('./../models/userModels')
exports.index = async(req,res) =>{

    const category = await Category.find();
    const artikel = await Artikel.find();
    const user = await User.find();
    res.status(200).render('admin/dasboard/index',{
        title : 'Dasboard',
        category,
        artikel,
        user
        
    })
}