const mongoose = require('mongoose');

function generateInvoiceNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        unique: true,
        default: generateInvoiceNumber
    },
    name: String,
    email: String,
    phoneNo: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    payment: {
        type: String,
        default: ''
    },
    cartItems: [{
        productId: {
            ref: 'product',
            type: String 
        },
        quantity: Number
    }]
}, {
    timestamps: true
});

const InvoiceModel = mongoose.model('invoice', invoiceSchema);

module.exports = InvoiceModel;
