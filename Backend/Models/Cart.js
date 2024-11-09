const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
        default: 'default-image-url.jpg', // Optional: set a default image URL
    },
    desc: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        trim: true,
    }
});

const cart = mongoose.model('cart', cartSchema);

module.exports = cart;