const express = require('express');
const router = express.Router();
const User = require('../models/user');
const isAdmin = require('../middleware/isAdmin');

// Mostrar todos los usuarios (solo para admin)
router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.render('admin/users', { users });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).send('Error al obtener usuarios');
  }
});

module.exports = router;
