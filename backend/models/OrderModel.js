const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        ref: 'invoice'
    },
    name: String,
    contactNo: String,
    email: String,
    address: String,
    products: [{
        productId: {
            ref: 'product',
            type: String
        },
        productName: String,
        quantity: Number,
        price: Number,
        imageUrl: String
    }],
    totalQty: Number,
    totalPrice: Number,
    paymentStatus: {
        type: String,
        default: 'Reviewing'
    }
}, {
    timestamps: true
});

const OrderModel = mongoose.model('order', orderSchema);

module.exports = OrderModel;
