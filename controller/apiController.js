const Category = require('./../models/categoryModels')
const Artikel = require('./../models/artikelModels')
const APIFeatures = require('../utils/apiFeatures');
const category = require('./../models/categoryModels');
const Visitor = require('./../models/visitorModels');
const catchAsync = require('../utils/catchAsync');

exports.artikelApi = async(req,res) =>{
    try {
            const features = new APIFeatures(Artikel.find().populate({path : 'category',select: 'categoryName'}), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
          const artikel = await features.query;
         

        

        res.status(200).json({
            status: 'success',
            total : artikel.length,
            data : artikel
                
            
        })

    } catch (error) {
        res.status(400).json({
                status: 'fail',
                message : error
                
                })
        }
    }

exports.detailArtikel = async(req,res) =>{
        try {
            const artikel = await Artikel.findOne({slug: req.params.slug}).populate({path : 'category',select: 'categoryName categorySlug artikel '})
            
        
            console.log(req.params.slug)
            res.status(200).json({
                status: 'success',
                data : {
                  artikel
            }
            
        })
    } catch (error) {
        res.status(500).json({
            status: 'success',
            message : error
            
        })
    }
}

exports.categoryApi = async(req,res ) =>{

    try {


        const features = new APIFeatures(Category.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const category = await features.query;

        res.status(200).json({
            status: 'success',
            total : category.length,
             category
            
        })
    } catch (error) {
        res.status(500).json({
            status: 'success',
            message : error
            
        })
    }
   
}
 exports.detailCategory = catchAsync(async(req,res) => {
    
         const category = await Category.find({categorySlug: req.params.slug}).populate({path: 'artikel',select:'-category -__v'})
        //  const tes = await  Category.findById({_id: category})
  
        for(let i = 0; i < category.length; i++) {
            category[i].totalvisit += 1
            await category[i].save()
        }
         res.status(200).json({
             status: 'success',
             category
             
         })


     

})

exports.similarArtikel = async(req,res) =>{
   
}