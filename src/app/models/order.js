const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: String,
    address: String,
    orderId: String,
    sessionId: String,
    price: Number,
    amount: Number,
    status: String,
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
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

const Order = mongoose.model('order', orderSchema);
module.exports = Order