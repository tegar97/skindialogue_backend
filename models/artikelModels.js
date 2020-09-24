const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema;
const slugify = require('slugify')

const artikelSchema = new mongoose.Schema({
    title : {
        type: String,
        required: [true,'title wajib di isi'],
    },
    category :[{
        type: ObjectId,
        required: [true,'category wajib di isi'],
        ref: 'category'
    }],
    thumbnail: {
        type: String,
        default: 'default.png'

    },
    content : {
        type: String,
        required : true
    },
    date :{
        type: Date,
        default: Date.now()
    },
  
    slug: String

})
artikelSchema.pre('save',function(next) {
    this.slug = slugify(this.title,{lower: true})
    next()
})
const artikel = mongoose.model('artikel',artikelSchema)

module.exports = artikel