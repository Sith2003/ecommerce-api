const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    },
    amount: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

const Cart = mongoose.model('cart', cartSchema);
module.exports = Cart;