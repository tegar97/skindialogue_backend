const Category = require('./../models/categoryModels')
const Artikel = require('./../models/artikelModels')
const category = require('./../models/categoryModels')
const path = require('path')

const fs = require('fs-extra')
exports.index = async(req,res) =>{
    const artikel = await Artikel.find()
    const alertMessage = req.flash('alertMessage')
    const alertStatus = req.flash('alertStatus')
    const alert = {message: alertMessage,status: alertStatus}


    res.status(200).render('admin/artikel/index',{
        title : 'Artikel',
        alert,
        artikel
        
        
    })
    
}

exports.create = async(req,res) =>{
    const category = await Category.find()
    res.status(200).render('admin/artikel/add_artikel',{
        title : 'Create Article',
        category
        
        
    })
}

exports.addArtikel = async(req,res) =>{
    try {

            const {title,category,artikel_content,image} = req.body
            
        if(category) {
            if(!req.file) {
                const ArtikelCreate = await Artikel.create({
                    title: title,
                    category: category,
                    content: artikel_content,
                    thumbnail: 'default.png',
                })  
            }else{
                const ArtikelCreate = await Artikel.create({
                    title: title,
                    category: category,
                    content: artikel_content,
                    thumbnail: req.file.filename,
                })  
            
                //memasukan artikel id ke field artikel di category
                for(let i = 0; i < category.length; i++) {
                    const categoryCollection = await Category.findById({_id:category[i]})
        
    
                    categoryCollection.artikel.push({_id : ArtikelCreate._id})
                    await categoryCollection.save()
                     
                        
    
                    }
              
                    
    
            }
        }
            
            
           
              

            
          
  
     
      
        req.flash('alertMessage','sukses publish post')
        req.flash('alertStatus','success')
        res.redirect('/artikel')
    } catch (error) {
        req.flash('alertMessage',`${error.message} `)
        req.flash('alertStatus','danger')
        res.redirect('/artikel')
    }
    
    
  
  
  
}
exports.editArtikel = async(req,res) => {
    const category = await Category.find()
    const artikel = await Artikel.findOne({_id : req.params.id});
    res.status(200).render('admin/artikel/edit_artikel',{
        title : 'Create Article',
        category,
        artikel
        
        
    })
}
exports.updateArtikel = async(req,res) => {
    try {
        const {title,category,artikel_content,image} = req.body

        const artikel = await Artikel.findOne({_id : req.params.id})
        console.log(artikel)

    
        if(!req.file) {
            const ArtikelCreate = await artikel.updateOne({
                title: title,
                category: category,
                content: artikel_content,
        
            })  
           
        }else{
            const ArtikelCreate = await artikel.updateOne({
                title: title,
                category: category,
                content: artikel_content,
                thumbnail: req.file.filename ,
            })  

            
           
            
        }
                         //memasukan artikel id ke field artikel di category
            for(let i = 0; i < category.length; i++) {
                const categoryCollection = await Category.findById({_id:req.body.category[i]})
                console.log(categoryCollection)
        
                
                categoryCollection.artikel.pull({_id : artikel._id})
                categoryCollection.artikel.push({_id : artikel._id})
                await categoryCollection.save()
                
                    
        
                }
            
       
    
            req.flash('alertMessage','sukses publish post')
            req.flash('alertStatus','success')
            res.redirect('/artikel')
    } catch (error) {
        console.log(error)
        req.flash('alertMessage',`${error.message} `)
        req.flash('alertStatus','danger')
        res.redirect('/artikel')
    }
  

}
exports.deleteArtikel  = async(req,res) => {

    try {
        const {id } = req.params
     
        const artikel = await Artikel.findOne({_id : id})
        
        for(let i = 0; i< artikel.category.length; i++) {
            const categoryCollection = await Category.findById({_id:artikel.category[i]})
            categoryCollection.artikel.pull({_id : artikel.id})
            await categoryCollection.save()

            console.log(categoryCollection)

        }
        if(artikel.thumbnail !== 'default.png') {
            await fs.unlink(path.join(`public/img/thumbnail/${artikel.thumbnail}`))
        }
        await artikel.remove()


        req.flash('alertMessage','sukses delete post')
        req.flash('alertStatus','success')
        res.redirect('/artikel')

    



    } catch (error) {
        req.flash('alertMessage',error)
        req.flash('alertStatus','danger')
        res.redirect('/artikel')
    }
}