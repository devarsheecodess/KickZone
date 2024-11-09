const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        trim: true,
    }
});

const Order = mongoose.model('Order', orderSchema);
