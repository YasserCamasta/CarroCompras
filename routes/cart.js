const express = require('express');
const router = express.Router();
const Product = require('../models/product'); 
const Order = require('../models/order'); 

// Ruta para mostrar el carrito
router.get('/', async (req, res) => {
  try {
    const cart = Array.isArray(req.session.cart) ? req.session.cart : [];
    const productIds = cart.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const cartItems = cart.map(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      const totalPrice = product.price * item.quantity;
      return {
        ...item,
        product,
        totalPrice
      };
    });
    const cartTotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
    res.render('cart', { cartItems, cartTotal });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el carrito');
  }
});

// Ruta para añadir un producto al carrito
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = Array.isArray(req.session.cart) ? req.session.cart : [];
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += parseInt(quantity, 10);
    } else {
      cart.push({ productId, quantity: parseInt(quantity, 10) });
    }
    req.session.cart = cart;
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al añadir al carrito');
  }
});

// Ruta para eliminar un producto del carrito
router.post('/remove', (req, res) => {
  try {
    const { productId } = req.body;
    let cart = Array.isArray(req.session.cart) ? req.session.cart : [];
    cart = cart.filter(item => item.productId !== productId);
    req.session.cart = cart;
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar del carrito');
  }
});

// Ruta para vaciar el carrito
router.get('/clear', (req, res) => {
  try {
    req.session.cart = [];
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al vaciar el carrito');
  }
});

// Ruta para procesar la compra
router.post('/checkout', async (req, res) => {
  try {
    const cart = Array.isArray(req.session.cart) ? req.session.cart : [];
    const productIds = cart.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const cartItems = cart.map(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      const totalPrice = product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        totalPrice
      };
    });
    const cartTotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
    const newOrder = new Order({
      items: cartItems,
      total: cartTotal,
      customerName: req.body.customerName
    });
    await newOrder.save();
    req.session.cart = [];
    res.redirect('/orders/confirmation');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar la compra');
  }
});

module.exports = router;
