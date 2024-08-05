const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const cartSchema = new mongoose.Schema({
    items: [cartItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    }
});

cartSchema.methods.calculateTotalPrice = function() {
    this.totalPrice = this.items.reduce((total, item) => total + item.quantity * item.product.price, 0);
    return this.totalPrice;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
