const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    categoryName: String,
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})
const Category = mongoose.model('category', categorySchema)
module.exports = Category