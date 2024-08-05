const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Ruta para mostrar los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener productos');
  }
});

module.exports = router;
