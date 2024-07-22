// backend/middleware/authToken.js
const jwt = require('jsonwebtoken');
const user = require('../models/userModel');

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token;
        console.log('token', token);

        if (!token) {
            return res.status(200).json({
                message: 'Please Login...!',
                error: true,
                success: false
            });
        }
        
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            if (err) {
                console.log('error auth', err);
                return res.status(401).json({
                    message: 'Authentication failed!',
                    error: true,
                    success: false
                });
            }

            req.user = { email: decoded?.email }; // Assuming the token contains the email
            next();
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;
