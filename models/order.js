const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{ productId: String, quantity: Number }],
  total: Number,
  createdAt: { type: Date, default: Date.now },
  customerName: String
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;
