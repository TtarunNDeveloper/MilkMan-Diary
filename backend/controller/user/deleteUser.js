const express = require('express');
const router = express.Router();
const User = require('../../models/userModel'); // Adjust the path as necessary

// Delete user endpoint
router.delete('/deleteUser', async (req, res) => {
    try {
        const { userId } = req.body;
        await User.findByIdAndDelete(userId);
        res.json({ success: true, message: 'User deleted successfully.' });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

module.exports = router;
