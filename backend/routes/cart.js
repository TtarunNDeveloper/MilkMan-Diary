// cart.js
const express = require('express');
const router = express.Router();
const addToCartModel = require('../models/cartProduct'); // Adjust the path as necessary
const auth = require('../middleware/authToken'); // Ensure this path is correct

router.get('/addtocart', auth, async (req, res) => {
    const emailId = req.user.email; // Assuming req.user contains the user info after authentication
    try {
        const cartData = await addToCartModel.find({ emailId }).populate('productId');
        res.json({ success: true, data: cartData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

module.exports = router;
