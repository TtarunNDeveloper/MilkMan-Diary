const express = require('express');
const router = express.Router();
const userSignUpController = require('../controller/user/userSignUp');
const userSignInController = require('../controller/user/userSignIn');
const userDetailsController = require('../controller/user/userDetails');
const authToken = require('../middleware/authToken');
const userLogout = require('../controller/user/userLogout');
const allUsers = require('../controller/user/allUsers');
const updateUser = require('../controller/user/updateUser');
const UploadProductController = require('../controller/product/uploadProduct');
const getProductController = require('../controller/product/getProduct');
const updateProductController = require('../controller/product/updateProduct');
const getCategoryProduct = require('../controller/product/getCategoryProductOne');
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct');
const getProductDetails = require('../controller/product/getProductDetails');
const addToCartController = require('../controller/user/addToCartController');
const countAddToCartProduct = require('../controller/user/countAddToCartProduct');
const addToCartViewProduct = require('../controller/user/addToCartViewProduct');
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct');
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct');
const searchProduct = require('../controller/product/searchProduct');
const filterProductController = require('../controller/product/filterProduct');
const deleteUser = require('../controller/user/deleteUser');
const InvoiceModel = require('../models/invoiceModel');
const CartProductModel = require('../models/cartProduct');

router.post('/signup', userSignUpController);
router.post('/signin', userSignInController);
router.get('/user-details',authToken, userDetailsController);
router.get('/userLogout', userLogout);

// admin panel 
router.get('/all-user', authToken, allUsers);
router.post('/update-user', authToken, updateUser);
router.post('/deleteUser',authToken,deleteUser);
// product 
router.post('/upload-product', authToken, UploadProductController);
router.get('/get-product', getProductController);
router.post('/update-product', authToken, updateProductController);
router.get('/get-categoryProduct', getCategoryProduct);
router.post('/category-product', getCategoryWiseProduct);
router.post('/product-details', getProductDetails);
router.get('/search', searchProduct);
router.post('/filter-product', filterProductController);

// user add to cart
router.post('/addtocart', authToken, addToCartController);
router.get('/countAddToCartProduct', authToken, countAddToCartProduct);
router.get('/view-card-product', authToken, addToCartViewProduct);
router.post('/update-cart-product', authToken, updateAddToCartProduct);
router.post('/delete-cart-product', authToken, deleteAddToCartProduct);


const OrderModel = require('../models/OrderModel');

router.post('/api/create-order', async (req, res) => {
    const { invoiceNumber, name, contactNo, emailId, address, products, paymentStatus } = req.body;

    try {
        const newOrder = new OrderModel({
            invoiceNumber,
            name,
            contactNo,
            emailId,
            address,
            products,
            paymentStatus
        });

        await newOrder.save();

        res.json({ success: true, message: 'Order created successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



router.post('/create-invoice', async (req, res) => {
    try {
        const invoice = new InvoiceModel(req.body);
        await invoice.save();
        res.json({ success: true, data: invoice });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.get('/invoice/:invoiceNumber', async (req, res) => {
    try {
        const invoice = await InvoiceModel.findOne({ invoiceNumber: req.params.invoiceNumber });
        if (!invoice) {
            return res.json({ success: false, message: 'Invoice not found' });
        }
        res.json({ success: true, data: invoice });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Fetch all invoices
router.get('/invoices', async (req, res) => {
    try {
        const invoices = await InvoiceModel.find();
        res.json({ success: true, data: invoices });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.json({ success: false, message: error.message });
    }
});

// routes/cartRoutes.js
router.get('/cart', async (req, res) => {
    try {
        const cartItems = await CartProductModel.find({ userId: req.user._id }).populate('productId');
        res.json({ success: true, data: cartItems });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// routes/invoiceRoutes.js
router.delete('/invoice/:id', async (req, res) => {
    try {
        const invoice = await InvoiceModel.findByIdAndDelete(req.params.id);
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }
        res.json({ success: true, message: 'Invoice deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



module.exports = router;
