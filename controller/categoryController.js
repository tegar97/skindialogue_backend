const Category = require('./../models/categoryModels')
exports.index = async(req,res) =>{
    const category = await Category.find()
    const alertMessage = req.flash('alertMessage')
    const alertStatus = req.flash('alertStatus')
    const alert = {message: alertMessage,status: alertStatus}


    res.status(200).render('admin/category/index',{
        title : 'Kategori Artikel',
        category,
        alert
        
    })
    
}
exports.addCategory =  async(req,res) => {
    try {
        const {name } =  req.body;
        await Category.create({categoryName : name})
        req.flash('alertMessage','sukses add category')
        req.flash('alertStatus','success')

        
        res.redirect('/category')
        
    } catch (error) {
    
        res.redirect('/category')
    }
    

}
exports.deleteCategory =  async(req,res) => {
    try {
        const category =  await Category.findByIdAndDelete(req.params.id)

        
        req.flash('alertMessage','sukses delete category')
        req.flash('alertStatus','success')
        res.redirect('/category')
    } catch (error) {
        req.flash('alertMessage',`${error.message} `)
        req.flash('alertStatus','danger')
        res.redirect('/category')
    }

}
exports.editCategory = async (req,res) =>{
    try {
    
        const { id,categoryName } = req.body;
        console.log(id)
        const category = await Category.findOne({_id: id})
        category.categoryName = categoryName
        await category.save()
        req.flash('alertMessage','sukses update category')
        req.flash('alertStatus','success')
        res.redirect('/category')
    } catch (error) {
        req.flash('alertMessage',`${error.message} `)
        req.flash('alertStatus','danger')
        res.redirect('/category')
    }
    
}