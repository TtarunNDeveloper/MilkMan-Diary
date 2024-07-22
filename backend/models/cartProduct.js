// cartProduct.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cartProductSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    // Other fields...
});

const CartProduct = mongoose.model('CartProduct', cartProductSchema);

module.exports = CartProduct;
