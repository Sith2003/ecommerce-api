const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: String,
    description: String,
    quantity: Number,
    price: Number,
    image: String,
    coverImage: [String],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "order"
    }],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

const Product = mongoose.model("product", productSchema);
module.exports = Product