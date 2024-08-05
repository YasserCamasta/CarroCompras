const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const isAdmin = require('../middleware/isAdmin');

// Ruta para mostrar todas las órdenes (solo para admin)
router.get('/', isAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.render('admin/orders', { orders });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).send('Error al obtener órdenes');
  }
});

// Ruta para la confirmación de la orden
router.get('/confirmation', (req, res) => {
  res.render('orders/confirmation');
});

module.exports = router;
