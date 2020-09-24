const mongoose = require('mongoose')
const slugify = require('slugify')
const { ObjectId } = mongoose.Schema;


const categorySchema = new mongoose.Schema({
    categoryName : {
        type: String,
        required: true,
    },
    categorySlug: {
        type: String,

    },
    totalvisit: {
        type: Number,
        default : 0
    },
    artikel : [{
        type: ObjectId,
        ref: 'artikel'
    }]
})
categorySchema.pre('save',function(next) {
    this.categorySlug = slugify(this.categoryName,{lower: true})
    next()
})
// categorySchema.pre(/^find/, function(next) {
//     this.totalvisit += 1
//     next()
// })
const category = mongoose.model('category',categorySchema)

module.exports = category