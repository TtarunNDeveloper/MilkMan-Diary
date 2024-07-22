const express = require('express');
const router = express.Router();
const InvoiceModel = require('../models/invoiceModel');

router.get('/invoice/:invoiceNumber', async (req, res) => {
    try {
        const invoice = await InvoiceModel.findOne({ invoiceNumber: req.params.invoiceNumber });
        if (invoice) {
            res.json({ success: true, data: invoice });
        } else {
            res.json({ success: false, message: 'Invoice not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
