const express = require('express');
const router = express.Router();
const OrderModel = require('../models/OrderModel');

router.post('/create-order', async (req, res) => {
    try {
        const order = new OrderModel(req.body);
        await order.save();
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
