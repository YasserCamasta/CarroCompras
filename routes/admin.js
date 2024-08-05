const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const isAdmin = require('../middleware/isAdmin'); // Asegúrate de que la ruta sea correcta

// Middleware de verificación de administrador
router.use(isAdmin);

// Mostrar formulario para agregar producto
router.get('/add-product', (req, res) => {
  res.render('admin/add-product');
});

// Agregar un nuevo producto
router.post('/add-product', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newProduct = new Product({ name, price, description });
    await newProduct.save();
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).send('Error al agregar producto');
  }
});

// Mostrar productos para administración
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('admin/products', { products });
  } catch (error) {
    console.error('Error al mostrar productos:', error);
    res.status(500).send('Error al mostrar productos');
  }
});

// Editar un producto
router.get('/edit-product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.render('admin/edit-product', { product });
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener producto para editar:', error);
    res.status(500).send('Error al obtener producto');
  }
});

router.post('/edit-product/:id', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, price, description });
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).send('Error al actualizar producto');
  }
});

// Eliminar un producto
router.get('/delete-product/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).send('Error al eliminar producto');
  }
});

module.exports = router;
