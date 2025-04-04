const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    productId: { type: String, required: true },
    image: {type: String, required: true},
    name: { type: String, required: true },
    price: {type: Number, required: true},
    quantity: { type: Number, required: true }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
