const addToCartModel = require("../../models/cartProduct");

const addToCartController = async(req, res) => {
    try {
        const {productId} = req?.body;
        const currentUser = req.user.email;
        console.log(`Adding product ${productId} to cart for user ${currentUser}`);

        const isProductAvailable = await addToCartModel.findOne({productId, userId: currentUser});
        console.log(`Product availability check for product ${productId} and user ${currentUser}:`, isProductAvailable);

        if(isProductAvailable) {
            console.log(`Product ${productId} already exists in the cart for user ${currentUser}`);
            return res.json({
                message: 'Already exists in Add to Cart',
                success: false,
                error: true
            })
        }

        const payload = {
            productId : productId,
            quantity : 1,
            email : currentUser
        }

        const newAddToCart = new addToCartModel(payload);
        const saveProduct = await newAddToCart.save();
        console.log(`Product ${productId} added to cart for user ${currentUser}`);
        return res.json({
            data: saveProduct,
            message: 'Product Added in Cart',
            success: true,
            error: false
        })

    } catch(err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false 
        })
    }
}

module.exports = addToCartController;
